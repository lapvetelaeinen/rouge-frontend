import React, { useEffect } from "react";
import styles from "../../../styles/payment.module.css";
import axios from "axios";

const PaymentStatus = (props) => {
  const [message, setMessage] = React.useState(null);
  const [paymentMeta, setPaymentMeta] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const paymentId = props.paymentId;

    if (!paymentId) {
      setMessage("Not found payment instance");
      setIsLoading(false);
      return;
    }

    const createOrder = async (params) => {
      await axios
        .post("/api/order-confirmation", params)
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
    };

    fetch("/api/payment/swish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "getPaymentStatus",
        paymentId: paymentId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(">>> Payment status", data);
        setPaymentMeta(data);
        switch (data.status) {
          case "CREATED":
            setMessage("Payment is created not paid yet.");
            break;
          case "PAID":
            setMessage("Payment succeeded!");
            console.log(data);
            createOrder(data);
            break;
          case "CANCELLED":
            setMessage("Your payment cancelled.");
            break;
          case "DECLINED":
            setMessage("Your payment declined.");
            break;
          case "ERROR":
            setMessage(
              "An error occurred, like the payment was blocked or timed out. See list of error codes for all potential error conditions."
            );
            break;
          case "fail":
            setMessage(data.message);
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
    <div id="swish-payment-status">
      <div>
        {isLoading ? (
          <h1 className={styles.paymentStatusMessage}>Loading...</h1>
        ) : (
          ""
        )}
      </div>
      {paymentMeta && paymentMeta.id && (
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
            <li>
              <b>Email</b>: {paymentMeta.email}
            </li>
          </ul>
        </div>
      )}

      {/* Show any error or success messages */}
      {message && !isLoading && (
        <div>
          <h1 className={styles.paymentStatusMessage}>Status: {message}</h1>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
