import { useRouter } from "next/router";
import { EventContext } from "../../contexts/EventContext";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import axios from "axios";
import Times from "../../components/svg/Times";

export default function EventPage({ data }) {
  const router = useRouter();
  const passedID = router.query.id;
  const [showModal, setShowModal] = useState(false);

  const [value, setValue] = useState("");
  const [price, setPrice] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
    const chosenTicket = thisEvent.tickets.find(
      (ticket) => ticket.class == event.target.value
    );
    setPrice(chosenTicket.price);
  };

  const openModal = () => {
    setPrice(thisEvent.tickets[0].price);
    setShowModal(!showModal);
  };

  const thisEvent = data.find((event) => event.eventId == passedID);

  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";
  const imagePath = BUCKET_URL + thisEvent.image;

  console.log(thisEvent.tickets);

  return (
    <div className="min-h-screen bg-neutral-800 relative">
      <div className="">
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
                    <p className="text-2xl">{thisEvent.title}</p>
                    <p>{thisEvent.date.substring(0, 10)}</p>
                  </div>
                </div>
                <div className="bg-neutral-300 mx-5 rounded-lg p-4 mb-4 shadow-md">
                  <div className="flex text-xl ">
                    <p className="text-neutral-700">Biljettklass:</p>
                    <select
                      value={value}
                      onChange={handleChange}
                      className="ml-4 bg-neutral-200 rounded-md text-neutral-500 shadow-sm"
                    >
                      {thisEvent.tickets.map((ticket) => (
                        <option key={ticket.class} value={ticket.class}>
                          {ticket.class}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className=" flex pt-4 text-xl text-neutral-700">
                    <p>Pris:</p>
                    <p className="pl-2">{price} SEK</p>
                  </div>
                </div>
                <div className="bg-neutral-300 mx-5 rounded-lg p-4 mb-4 shadow-md">
                  <div className="flex text-xl text-neutral-700">
                    <p>Viktig info!</p>
                  </div>
                  <div className=" flex pt-4 text-xl">
                    <p className="text-base text-neutral-500">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Proin sit amet augue vehicula, malesuada enim et, vehicula
                      enim. Morbi quis faucibus orci.
                    </p>
                  </div>
                </div>
                <div className="mx-5">
                  <button className="bg-gradient-to-r from-[#d57187] to-violet-400 w-full  text-4xl font-steelfish text-neutral-800 rounded-lg py-6 shadow-lg">
                    KÖP
                  </button>
                </div>
                <p className="text-xs text-center pt-4 text-neutral-500">
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
          {thisEvent.title}
        </h1>

        <p className="pl-2 pt-2 font-appareo text-xl text-neutral-400">
          {thisEvent.date}
        </p>

        <p className="pl-2 pt-2 text-2xl text-neutral-300">
          {thisEvent.description}
        </p>
        <button
          className="bg-gradient-to-r from-[#d57187] to-violet-400 w-full fixed bottom-0 h-20 text-3xl font-steelfish text-neutral-800"
          onClick={() => openModal()}
        >
          KÖP BILJETT FRÅN {thisEvent.tickets[0].price} SEK
        </button>
      </div>
    </div>
  );
}

export const getStaticPaths = async () => {
  const res = await fetch("https://rouge-admin-app.vercel.app/api/events");
  const data = await res.json();

  const paths = data.map((event) => ({
    params: { id: event.eventId },
  }));

  return { paths, fallback: "blocking" };
};

export async function getStaticProps({ params }) {
  // could try to just fetch one event using the params
  const res = await fetch("https://rouge-admin-app.vercel.app/api/events");
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
}
