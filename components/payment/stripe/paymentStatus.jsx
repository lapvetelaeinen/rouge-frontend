import React, { useEffect } from "react";
import axios from "axios";
import styles from "../../../styles/payment.module.css";
import { getTicket } from "../../../pages/api/fetchTicket";

const PaymentStatus = (props) => {
  const [message, setMessage] = React.useState(null);
  const [paymentMeta, setPaymentMeta] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const createOrder = async (params) => {

    const removedSpaces = params.eventName.replace(/\s+/g, "-").toLowerCase();
    const eventName = removedSpaces
      .replace(/å/g, "_aa_")
      .replace(/Å/g, "_AA_")
      .replace(/ä/g, "_ae_")
      .replace(/Ä/g, "_AE_")
      .replace(/ö/g, "_oe_")
      .replace(/Ö/g, "_OE_");

    const ticket = await axios.get(`https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/fetch-ticket?eventName=${eventName}&orderId=${params.ticketId}`);

    if(ticket.data.eventName){
      return;
    };

    await axios.post("https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/rouge-stripe-payment", params).catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });



    // axios({
    //   method: "post",
    //   url: "https://aw2406aj4d.execute-api.eu-west-2.amazonaws.com/pup/puppy",
    //   headers: {},
    //   data: JSON.stringify({
    //     recipent: params.email,
    //     ticketId: params.ticketId,
    //     eventName: params.eventName,
    //     ticketClass: params.ticketClass
    //   }),
    // });


    const removeDash = params.eventName.replace(/-/g, " ").toUpperCase();
    const formattedName = removeDash
      .replace(/_AA_/g, "Å")
      .replace(/_AE_/g, "Ä")
      .replace(/_OE_/g, "Ö");




    const randomNumber = Math.floor(Math.random() * 90000) + 10000;

    axios({
      method: "post",
      url: "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/send-ticket",
      headers: {},
      data: JSON.stringify({
        recipent: params.email,
        ticketLink: "https://rougeumea.se/tickets/" + eventName + "/" + params.ticketId,
        eventName: eventName,
        realName: formattedName,
        randomNumber: randomNumber
      }),
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
