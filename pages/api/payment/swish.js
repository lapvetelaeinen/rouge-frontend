import {
  config,
  createPayment,
  getQrCode,
  getPaymentDetails,
} from "../../../services/swishClient";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }

  const body = req.body;
  const type = body.type;

  if (type === "paymentrequests") {
    const data = {
      // "payeePaymentReference": body.eventId, // Not valid this id as reference
      payeeAlias: config.payeeAlias,
      currency: config.currency,
      callbackUrl: config.callbackUrl,
      amount: String(body.totalPrice),
      message: body.event,
    };

    try {
      const result = await createPayment(data);

      if (result && result.id && !result.errorMessage) {
        // store this token after that will not able to find
        const token = result.token || result.paymentReference;
        res.status(200).send({
          status: "success",
          id: result.id,
          token: token,
          paymentStatus: result.status,
        });
        return;
      }

      res.status(400).send({
        status: "fail",
        message: result.errorMessage || "Something wrong please try again",
      });
      return;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).send("some kind of error");
      // res.status(500).json({ statusCode: 500, message: errorMessage });
      return;
    }
  }

  if (type === "getQrCode") {
    try {
      const token = body.token;
      if (!token) {
        res.status(400).send({
          status: "fail",
          message: "Token is required",
        });
        return;
      }

      const result = await getQrCode(token);

      if (result.status === 200) {
        // Qr code image
        res.setHeader("Content-Type", "image/*");
        res.status(200).send(result.body);
        return;
      }

      res.status(400).send({
        status: "fail",
        message: result.errorMessage || "Something wrong please try again",
      });
      return;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).send("some kind of error");
      // res.status(500).json({ statusCode: 500, message: errorMessage });
      return;
    }
  }

  if (type === "getPaymentStatus") {
    try {
      const paymentId = body.paymentId;
      if (!paymentId) {
        res.status(400).send({
          status: "fail",
          message: "Payment id is required",
        });
        return;
      }

      const paymentUrl = `${config.host}/api/v1/paymentrequests/${paymentId}`;
      const result = await getPaymentDetails(paymentUrl);

      if (result && result.id && !result.errorMessage) {
        // Update payment status on database
        res.status(200).send(result);
        return;
      }

      res.status(400).send({
        status: "fail",
        message: result.errorMessage || "Something wrong please try again",
      });
      return;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).send("some kind of error");
      // res.status(500).json({ statusCode: 500, message: errorMessage });
      return;
    }
  }
};

export default handler;
