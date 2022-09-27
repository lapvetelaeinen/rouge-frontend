import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Times from "../../components/svg/Times";
import StripePayment from "../../components/payment/stripe";
import SwishPayment from "../../components/payment/swish";

export default function EventsPage({ data }) {
  const router = useRouter();
  const passedID = router.query.id;
  const [showModal, setShowModal] = useState(false);

  const [allTickets, setAllTickets] = useState(null);

  const [payError, setPayError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [email, setEmail] = useState("");
  const [value, setValue] = useState("");
  const [price, setPrice] = useState("");
  const [ticketClass, setTicketClass] = useState("");
  const [orderDetail, setOrderDetail] = useState();

  const [payMethod, setPayMethod] = useState(null);



  const onSubmit = async () => {
    if (!validateEmail(email)) {
      setEmailError("*Ange en giltig email");
      return;
    } else {
      setEmailError(null);
    }
    if (!payMethod) {
      setPayError("*Välj betalsätt för att gå vidare.");
      return;
    } else {
      setPayError(null);
    }

    const randomNumber = Math.floor(Math.random() * 90000) + 10000;

    const order = {
      event: data.eventName,
      randomNumber: randomNumber,
      ticketClass: ticketClass,
      quantity: 1,
      totalPrice: price,
      paymentMethod: payMethod,
      email: email,
      color: ticketClass,
    };
    console.log(">>>order>>>", order);

    const orderDetails = {
      order,
    };

    setOrderDetail(order);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    const chosenTicket = allTickets.find(
      (ticket) => ticket.ticketClass == event.target.value
    );
    setTicketClass(chosenTicket.ticketClass);
    setPrice(chosenTicket.price);
    console.log(ticketClass);
  };

  const openModal = () => {
    setPrice(allTickets[0].price);
    setTicketClass(allTickets[0].ticketClass);
    setShowModal(!showModal);
  };

  const paymentClick = (e) => {
    if (payMethod !== e.currentTarget.id) {
      setPayMethod(e.currentTarget.id);
    } else {
      setPayMethod("");
    }
  };

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleCancel = () => {
    console.log("Cencel Payment");
    setOrderDetail(null);
  };



  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";
  const imagePath = BUCKET_URL + data.image;

  const getAllTickets = async () => {
    if (!allTickets){
      const biljetter = await axios.get(`https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-tickets?eventName=${data.eventName}`);
      setAllTickets(biljetter.data);
      console.log("TICKETS>>>>", biljetter);
      return;
    } console.log("WE HAVE TICKETS");
  }

  getAllTickets();


  return (
    <div className="min-h-screen bg-neutral-800 relative">
      <div className="">
        {orderDetail && orderDetail.paymentMethod === "stripe" ? (
          <StripePayment order={orderDetail} onCancel={handleCancel} />
        ) : (
          ""
        )}

        {orderDetail && orderDetail.paymentMethod === "swish" ? (
          <SwishPayment order={orderDetail} onCancel={handleCancel} />
        ) : (
          ""
        )}

        {showModal ? (
          <div className="bg-neutral-800 absolute z-50 h-full w-full flex justify-center items-start bg-opacity-80">
            <div className="bg-neutral-200 w-full min-h-[700px] m-4 rounded-3xl">
              <div className="flex flex-col">
                <div className="flex justify-between p-1">
                  <p></p>
                  <Times
                    width={50}
                    height={50}
                    fill="#f57971"
                    onClick={() => setShowModal(!showModal)}
                  />
                </div>
                <div className="mx-5 flex items-center mb-8">
                  <Image
                    src={imagePath}
                    width={100}
                    height={100}
                    className="rounded-md"
                    alt=""
                  />
                  <div className="pl-5 text-neutral-700">
                    <p className="text-2xl">{data.eventName}</p>
                    <p>Gäller valfri dag under insparken</p>
                  </div>
                </div>
                <div className="bg-neutral-300 mx-5 rounded-lg p-4 mb-4 shadow-md ">
                  <div className="flex text-xl">
                    <p className="text-neutral-700">Biljettklass:</p>
                    <select
                      value={value}
                      onChange={handleChange}
                      className="ml-4 bg-neutral-200 rounded-md text-neutral-500 shadow-sm"
                    >
                      {allTickets.map((ticket) => (
                        <option key={ticket.ticketClass} value={ticket.ticketClass}>
                          {ticket.ticketClass}
                        </option>
                      ))}
                    </select>
                    {/* <input
                      type="number"
                      className="ml-2 bg-neutral-200 rounded-md text-neutral-500 shadow-sm w-[30px] text-center"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    /> */}
                  </div>

                  <div className=" flex pt-4 text-3xl text-neutral-700 justify-center font-bold">
                    <p>Pris:</p>
                    <p className="pl-2">{price} SEK</p>
                  </div>
                </div>
                {ticketClass != "Vanlig" ? (
                  <>
                    <p className="text-center text-red-500">Viktigt!</p>
                    <p className="text-center px-4 pb-4 text-red-500">
                      Vid köp av grön eller röd biljett så måste du visa upp
                      giltigt band vid entrén.
                    </p>
                  </>
                ) : null}
                    <p className="text-center px-4 pb-4 text-red-500">
                      Biljetten är inte återbetalningsbar. Köpt biljett är ingen garanti för att ta sig in ifall lokalens max-kapacitet nåtts.
                    </p>

                <div className="bg-neutral-300 mx-5 rounded-lg p-4 mb-4 shadow-md ">
                  <div className="flex flex-col text-xl">
                    <p className="text-neutral-700">
                      Vart ska vi skicka dina biljetter?
                    </p>
                    <input
                      type="email"
                      className="mt-4 bg-neutral-200 rounded-md text-neutral-500 shadow-sm"
                      placeholder="partyqueen@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError ? (
                      <p className="text-sm pt-2 text-red-500">{emailError}</p>
                    ) : null}
                  </div>
                </div>
                <div className="bg-neutral-300 mx-5 rounded-lg p-4 mb-4 shadow-md">
                  <div className="flex flex-col text-xl text-neutral-700">
                    <p>Välj betalsätt</p>
                  </div>
                  <div className="pt-4 flex justify-between items-center gap-4">
                    {payMethod == "swish" ? (
                      <div
                        id="swish"
                        className="border-4 border-violet-400 bg-neutral-200 bg-swish h-[80px] bg-contain bg-no-repeat w-full bg-center p-3 border-violet-400 rounded-xl shadow-md"
                        onClick={(e) => paymentClick(e)}
                      ></div>
                    ) : (
                      <div
                        id="swish"
                        className="bg-neutral-200 bg-swish h-[80px] bg-contain bg-no-repeat w-full bg-center p-3 border-violet-400 rounded-xl shadow-md"
                        onClick={(e) => paymentClick(e)}
                      ></div>
                    )}
                    {payMethod == "stripe" ? (
                      <div
                        id="stripe"
                        className="border-4 border-violet-400 bg-neutral-200 bg-visa h-[80px] bg-contain bg-no-repeat w-full bg-center p-3 border-violet-400 rounded-xl shadow-md"
                        onClick={(e) => paymentClick(e)}
                      ></div>
                    ) : (
                      <div
                        id="stripe"
                        className="bg-neutral-200 bg-visa h-[80px] bg-contain bg-no-repeat w-full bg-center p-3 border-violet-400 rounded-xl shadow-md"
                        onClick={(e) => paymentClick(e)}
                      ></div>
                    )}
                  </div>
                  {payError ? (
                    <p className="text-sm pt-2 text-red-500">{payError}</p>
                  ) : null}
                </div>
                <div className="mx-5">
                  <button
                    className="bg-gradient-to-r from-[#d57187] to-violet-400 w-full  text-4xl font-steelfish text-neutral-800 rounded-lg py-6 shadow-lg"
                    onClick={onSubmit}
                  >
                    BETALA
                  </button>
                </div>
                <p className="text-xs text-center pt-4 pb-4 text-neutral-500">
                  Genom att klicka på köp så godkänner du våra villkor för
                  biljettköp.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="relative">
        <Image
          src={imagePath}
          alt=""
          className=""
          priority
          height={400}
          width={400}
        />
        <div className="bg-gradient-to-t from-neutral-800 h-60 absolute bottom-0 w-full"></div>
      </div>
      <div className="">
        <h1 className="text-8xl font-steelfish pl-2 pt-4 text-[#d57187]">
          {data.eventName.split("_")[0].replace("-", " ").toUpperCase()}
        </h1>

        <p className="pl-2 pt-2 font-appareo text-xl text-neutral-400">
          {data.eventDate.substring(0, 10)}
        </p>

        <p className="pl-2 pt-2 text-2xl text-neutral-300">
          {data.description}
        </p>
        <button
          className="bg-gradient-to-r from-[#d57187] to-violet-400 w-full fixed bottom-0 h-20 text-3xl font-steelfish text-neutral-800"
          onClick={() => openModal()}
        >
          KÖP BILJETT
        </button>
      </div>
    </div>
  );
}


export const getStaticPaths = async () => {
    const res = await fetch("https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-events");
    const data = await res.json();
  
    const paths = data.map((event) => ({
      params: { eventName: event.eventName },
    }));
  
    return { paths, fallback: "blocking" };
  };
  
  export async function getStaticProps({ params }) {
    // could try to just fetch one event using the params
    const res = await fetch(`https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-event?eventName=${params.eventName}`);
    const data = await res.json();
  
    return {
      props: {
        data,
      },
    };
  }