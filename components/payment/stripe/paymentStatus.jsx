import React, { useEffect } from "react";
import axios from "axios";
import styles from "../../../styles/payment.module.css";

const PaymentStatus = (props) => {
  const [message, setMessage] = React.useState(null);
  const [paymentMeta, setPaymentMeta] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const createOrder = async (params) => {
    await axios.post("/api/order-confirmation", params).catch(function (error) {
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
            setMessage("Payment succeeded!");
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
        <div className="flex">
          <ul>
            <li>
              <b>Email</b>: {paymentMeta.email}
            </li>
            <li>
              <b>EventId</b>: {paymentMeta.eventId}
            </li>
            <li>
              <b>Event Name</b>: {paymentMeta.eventName}
            </li>
            <li>
              <b>Quantity</b>: {paymentMeta.quantity}
            </li>
            <li>
              <b>Ticket Class</b>: {paymentMeta.ticketClass}
            </li>
            <li>
              <b>Total Price</b>: {paymentMeta.totalPrice}
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
