import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Times from "../components/svg/Times";
import StripePayment from "../components/payment/stripe";
import SwishPayment from "../components/payment/swish";
import BandImage from "../assets/img/red-band.jpg";

export default function EventPage() {
  const router = useRouter();
  const passedID = router.query.id;
  const [showModal, setShowModal] = useState(false);

  const [payError, setPayError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [email, setEmail] = useState("");
  const [value, setValue] = useState(50);
  const [price, setPrice] = useState(50);
  const [ticketClass, setTicketClass] = useState("Sponsor");
  const [orderDetail, setOrderDetail] = useState();

  const [quantity, setQuantity] = useState(1);
  const [payMethod, setPayMethod] = useState(null);

  const createOrder = async (params) => {
    await axios.post("/api/create-order", params);
  };

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
      event: "INSPARK",
      eventId: "INSPARK2022",
      ticketClass: ticketClass,
      randomNumber: randomNumber,
      quantity: 1,
      totalPrice: quantity * price,
      paymentMethod: payMethod,
      email: email,
      color: "Röd",
    };
    console.log(">>>order>>>", order);

    const orderDetails = {
      order,
    };

    // api call here
    // createOrder(order);

    // if(payMethod === "swish") {
    //   await createSwishPaymentRequest(order)
    //   return
    // }

    setOrderDetail(order);
  };

  const handleChange = (event) => {
    // setValue(event.target.value);
    // const chosenTicket = thisEvent.tickets.find(
    //   (ticket) => ticket.class == event.target.value
    // );
    // setPrice(chosenTicket.price);
  };

  const openModal = () => {
    // setPrice(thisEvent.tickets[0].price);
    // setTicketClass(thisEvent.tickets[0].class);
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

  //   const thisEvent = data.find((event) => event.eventId == passedID);

  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";
  //   const imagePath = BUCKET_URL + thisEvent.image;

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
                    src={BandImage}
                    width={100}
                    height={100}
                    className="rounded-md"
                    alt=""
                  />
                  <div className="pl-5 text-neutral-700">
                    <p className="text-2xl">Kårhus-entré</p>
                    <p>Valfritt datum under insparken</p>
                  </div>
                </div>
                <div className="bg-neutral-300 mx-5 rounded-lg p-4 mb-4 shadow-md ">
                  <div className=" flex pt-4 text-3xl text-neutral-700 justify-center font-bold">
                    <p>Pris:</p>
                    <p className="pl-2">50 SEK</p>
                  </div>
                    <p className="text-center px-4 pb-4 text-red-500">
                      Biljetten är inte återbetalningsbar. Köpt biljett är ingen garanti för att ta sig in ifall lokalens max-kapacitet nåtts.
                    </p>
                </div>
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
                  Genom att klicka på betala så godkänner du våra villkor för
                  biljettköp.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="relative">
        <Image
          src={BandImage}
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
          Kårhus-entré
        </h1>

        <p className="pl-2 pt-2 font-appareo text-xl text-neutral-400">
          Gäller valfritt datum under insparken
        </p>

        <p className="pl-2 pt-2 text-2xl text-neutral-300">
          För att kunna använda denna biljett så måste du uppvisa ett giltigt
          band vid entrén. Vi ses på Rouge!
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
