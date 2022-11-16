import React, { useEffect } from "react";
import axios from "axios";
import styles from "../../../styles/payment.module.css";

const PaymentStatus = (props) => {
  const [message, setMessage] = React.useState(null);
  const [paymentMeta, setPaymentMeta] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const createOrder = async (params) => {
    await axios.post("https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/rouge-stripe-payment", params).catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  };

  useEffect(() => {
    const payment_intent_id =
      props.paymentId ||
      new URLSearchParams(window.location.search).get("payment_intent");

    if (!payment_intent_id) {
      setMessage("Not found payment instance");
      setIsLoading(false);
      return;
    }

    fetch("/api/payment/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "checkStatus",
        payment_intent_id: payment_intent_id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(">>> Payment status", data);
        setPaymentMeta(data.metadata);
        data;
        switch (data.paymentStatus) {
          case "succeeded":
            setMessage("success");
            createOrder(data.metadata);
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
        return true;
      })
      .catch((error) => {
        setMessage(error.message || "Something went wrong.");
        return false;
      });
    setIsLoading(false);
  }, []);

  return (
    <div id="stripe-payment-status">
      <div>
        {isLoading ? (
          <h1 className={styles.paymentStatusMessage}>Loading...</h1>
        ) : (
          ""
        )}
      </div>
      {paymentMeta && paymentMeta.eventId && (
        <div id="swish-payment-status" className="h-screen bg-neutral-800">
          <div>
            {isLoading ? (
              <h1 className={styles.paymentStatusMessage}>Loading...</h1>
            ) : (
              ""
            )}
          </div>
          {/* {paymentMeta && paymentMeta.id && (
        <div className="flex">
          <ul>
            <li>
              <b>Message</b>: {paymentMeta.message}
            </li>
            <li>
              <b>Amount</b>: {paymentMeta.amount}
            </li>
            <li>
              <b>Status</b>: {paymentMeta.status}
            </li>
          </ul>
        </div>
      )} */}

          {/* Show any error or success messages */}
          {message === "pending" && !isLoading && (
            <div className="flex flex-col justify-center items-center pt-20 text-center">
              <div className="bg-neutral-300 p-10 rounded-lg">
                <h1 className="text-2xl text-neutral-800">
                  Väntar på betalning...
                </h1>
                <p className="pt-10 text-xl text-neutral-600">
                  Trött på att vänta?
                </p>
                <button
                  className="bg-violet-400 p-4 rounded-md shadow-md mt-5 text-neutral-700"
                  onClick={() => setIsClicked(!isClicked)}
                >
                  Gå före i kön
                </button>
              </div>
            </div>
          )}
          {message === "success" ? (
            <>
              <div className="flex justify-center font-steelfish text-[60px] text-[#d57187]">
                <h2>Tack för ditt köp!</h2>
              </div>
              <p className="text-center text-neutral-400">
                En QR-kod skickas strax till {paymentMeta.email}.
              </p>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
