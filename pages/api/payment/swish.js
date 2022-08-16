// import {
//   createPayment,
//   getQrCode,
//   getPaymentDetails,
// } from "../../../services/swishClient";

// IMPORTED ALL swishClient.js files

import fs from "fs";
import path from "path";
import https from "https";
import fetch from "node-fetch";
import axios from "axios";

const ROOT_PATH = process.cwd();
const testConfig = {
  payeeAlias: "1231181189",
  currency: "SEK",
  callbackUrl: "https://localhost:3000/payment-status",
  host: "https://mss.cpc.getswish.net/swish-cpcapi",
  qrHost: "https://mpc.getswish.net/qrg-swish",
  cert: path.resolve(
    ROOT_PATH,
    "ssl/Swish_Merchant_TestCertificate_1234679304.pem"
  ),
  key: path.resolve(
    ROOT_PATH,
    "ssl/Swish_Merchant_TestCertificate_1234679304.key"
  ),
  ca: path.resolve(ROOT_PATH, "ssl/Swish_TLS_RootCA.pem"),
  passphrase: "swish",
};
const prodConfig = {
  payeeAlias: process.env.SWISH_PAYEE_ALIAS || "",
  currency: "SEK",
  callbackUrl: "https://rouge-frontend.vercel.app/payment-status",
  host: "https://cpc.getswish.net/swish-cpcapi",
  qrHost: "https://mpc.getswish.net/qrg-swish",
  cert: path.resolve(ROOT_PATH, "ssl/prod.pem"),
  key: path.resolve(ROOT_PATH, "ssl/prod.key"),
  passphrase:
    process.env.SWISH_SSL_PASSPHRASE === "null"
      ? null
      : process.env.SWISH_SSL_PASSPHRASE,
};
console.log("> App run on ", process.env.NODE_ENV, " mode.");
const config = process.env.NODE_ENV === "development" ? testConfig : prodConfig;

const agent = new https.Agent({
  cert: `${fs.readFileSync(config.cert, { encoding: "utf8" })}`, // public key
  key: fs.readFileSync(config.key, { encoding: "utf8" }), // private key
  ca: config.ca ? fs.readFileSync(config.ca, { encoding: "utf8" }) : null, // rooot cirtificate optional
  passphrase: config.passphrase,
});

const getPaymentDetails = async (location) => {
  return await fetch(location, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    agent,
  })
    .then((res) => res.json())
    .catch((error) => {
      console.log("> ERROR[getPaymentDetails]: ", error.message);
      return { errorMessage: error.message };
    });
};

const createPayment = async (data) => {
  const response = await fetch(`${config.host}/api/v1/paymentrequests`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    agent,
  }).catch((error) => {
    console.log("> ERROR[createPayment]: ", error.message);
    return { errorMessage: error.message };
  });

  if (response.status === 201) {
    const paymentLink =
      response.headers.get("location") || response.headers["location"];
    const token =
      response.headers.get("paymentrequesttoken") ||
      response.headers["paymentrequesttoken"];
    const result = await getPaymentDetails(paymentLink);
    return {
      token,
      ...result,
    };
  }

  // Error handling known & unknown
  let errorMessage = "Something wrong please try again";
  try {
    // Known error
    const err = await response.json();
    return err[0] || { errorMessage };
  } catch (error) {
    // Unknown error
    errorMessage = error.message;
  }

  return { errorMessage };
};

const getQrCode = async (
  token,
  { size = "300", format = "png", border = "0" } = {}
) => {
  const data = { token, size, format, border };
  return await fetch(`${config.qrHost}/api/v1/commerce`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    agent,
  }).catch((error) => {
    console.log("> ERROR[getQrCode]: ", error.message);
    return { errorMessage: error.message };
  });
};

// OLD CODE BELOW

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

        console.log("WE HAVE RESULT: ", result);

        await axios({
          method: "post",
          url: "https://svngddunt0.execute-api.eu-west-2.amazonaws.com/tick/ticket",
          headers: {},
          data: {
            ticketId: result.id,
            eventId: "req.body.eventId",
            event: "req.body.eventName",
            ticketClass: "req.body.ticketClass",
            owner: "req.body.email",
            used: false,
            paymentStatus: result,
          },
        });

        return;
      }

      res.status(400).send({
        status: "fail",
        message: result.errorMessage || "Something wrong please try again",
      });
      return;
    } catch (err) {
      console.log(">> err type: ", type);
      console.log(">> err: ", err);
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
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
      console.log(">> err type: ", type);
      console.log(">> err: ", err);
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
      return;
    }
  }

  if (type === "getPaymentStatus") {
    try {
      const paymentId = body.paymentId;
      const customerEmail = body;
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
        res
          .status(200)
          .send({ result: result, customer: { email: customerEmail } });
        return;
      }

      res.status(400).send({
        status: "fail",
        message: result.errorMessage || "Something wrong please try again",
      });
      return;
    } catch (err) {
      console.log(">> err type: ", type);
      console.log(">> err: ", err);
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
      return;
    }
  }
};

export default handler;
