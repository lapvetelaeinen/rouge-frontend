import React, { useEffect, useState } from "react";
import styles from "../../../styles/payment.module.css";
import axios from "axios";

const PaymentStatus = (props) => {
  const [message, setMessage] = React.useState(null);
  const [paymentMeta, setPaymentMeta] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState("");

  async function checkTicket(ticketId) {

    //CHECK IF REQUEST EXIST AND THEN MOVE IT TO TICKET DB

    const url =
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/handle-swish-request";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        eventName: "zara-larsson",
        orderId: ticketId,
      }),
    };
    await fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log("RESPONSE FROM API: ", data);

        if (data.paymentStatus === "PAID") {
          return;
        }

        console.log("this is the data: ", data);

        //SEND EMAIL BELOW

        axios({
          method: "post",
          url: "https://aw2406aj4d.execute-api.eu-west-2.amazonaws.com/pup/puppy",
          headers: {},
          data: JSON.stringify({
            recipent: data.customer,
            ticketId: ticketId,
            eventName: data.eventName
          }),
        });

        // END SEND EMAIL



        // axios({
        //   method: "patch",
        //   url: "https://svngddunt0.execute-api.eu-west-2.amazonaws.com/tick/ticket",
        //   headers: {},
        //   data: {
        //     ticketId: ticketId,
        //     updateKey: "paymentStatus",
        //     updateValue: "PAID",
        //   },
        // });

        setOwnerEmail(data.customer);
      });
  }

  useEffect(() => {
    const paymentId = props.paymentId;

    if (!paymentId) {
      setMessage("Not found payment instance");
      setIsLoading(false);
      return;
    }

    const checkDatabaseStatus = async (params) => {
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

    const res = fetch(
      "https://svngddunt0.execute-api.eu-west-2.amazonaws.com/tick/tickets"
    );

    res
      .then((value) => value.json())
      .then((data) => {
        console.log(data);
      });

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
        switch (data.result.status) {
          case "CREATED":
            setMessage("pending");
            // make this prettier
            setTimeout(wait, 3000);
            function wait() {
              setIsClicked(!isClicked);
            }
            break;
          case "PAID":
            setMessage("success");
            checkTicket(paymentId);
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
  }, [isClicked]);

  return (
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
            En QR-kod skickas strax till {ownerEmail}.
          </p>
        </>
      ) : null}
    </div>
  );
};

export default PaymentStatus;
