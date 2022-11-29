import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getTicket } from "../../api/fetchTicket";
import { getEvent } from "../../api/fetchEvent";
import Image from "next/image";
import Warning from "../../../components/svg/Warning";
import axios from "axios";
import useSWR from "swr";

export default function SingleTicketPage({ ticketDetails, eventDetails }) {
  const router = useRouter();
  const [useClicked, setUseClicked] = useState(false);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, mutate } = useSWR(
    `https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/fetch-ticket?eventName=${eventDetails.eventName}&orderId=${ticketDetails.orderId}`,
    fetcher
  );

  console.log("DATA: ", data);

  const ticketUse = async () => {
    const params = {
        eventName: eventDetails.eventName,
        orderId: ticketDetails.orderId
    }
    console.log("THIS IS PARAMS: ", params);

    setUseClicked(false);
    const res = await axios.post(`https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/use-ticket`, params);

    mutate();
  };

  const fetchTickets = async () => {
    const res = await fetch(
      `https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/fetch-ticket?eventName=25-nov-lov1-löning&orderId=02457CE88A714025B912271EF889E16C`
    );
    const data = await res.json();
    setTicketDetails(data);
  };

  const fetchEvent = async () => {
    const res = await fetch(
      `https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-event?eventName=25-nov-lov1-löning`
    );
    const data = await res.json();
    setEventDetails(data);
  };

  useEffect(() => {
    // console.log("NAME: ", eventName);
    // fetchTickets();
    // fetchEvent();
  }, []);

  console.log(ticketDetails);
  console.log(eventDetails);

  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";
  const eventImage = BUCKET_URL + eventDetails.image;

  if (!data) return "Loading...";

  const removeDash = eventDetails.eventName.replace(/-/g, " ").toUpperCase();
  const formattedName = removeDash
    .replace(/_AA_/g, "Å")
    .replace(/_AE_/g, "Ä")
    .replace(/_OE_/g, "Ö");

  return (
    <>
      <div className="p-4 bg-neutral-800 min-h-screen">
        <div className="shadow-lg rounded-2xl w-full relative">
          <div
            className={`absolute top-0 h-full w-full flex items-center justify-center z-50 ${
              useClicked ? "bg-yellow-400" : "bg-[rgba(0,0,0,0.2)]"
            } ${data.used ? "bg-green-500 opacity-50" : null} rounded-2xl`}
          >
            {useClicked ? (
              <div className="flex flex-col items-center">
                <Warning width={80} height={80} fill="crimson" />
                <div className="flex flex-col items-center text-center w-[80%]">
                  <h2 className="text-2xl font-bold">Varning!</h2>
                  <p className="font-bold text-red-600 mt-2">Om du trycker på röda knappen så är biljetten inte längre giltig!</p>
                  <p className="mt-2">Låt endast personalen i dörren klicka på röda knappen.</p>
                </div>
                <button className="bg-neutral-400 text-neutral-900 w-4/5 h-16 rounded-2xl shadow-inner mt-6" onClick={() => setUseClicked(false)}>Avbryt</button>
                <button className="bg-red-500 text-neutral-900 w-4/5 h-16 shadow-sm mt-6 font-bold border-2 border-black" onClick={() => ticketUse()}>Förbruka</button>
              </div>
            ) : (
                <>
              <button
                className={`bg-red-400 py-8 px-20 leading-none text-lg font-bold rounded-2xl shadow-xl text-neutral-800 ${data.used ? "hidden" : null}`}
                onClick={() => setUseClicked(true)}
              >
                Förbruka
              </button>
              <p className={`font-bold text-4xl ${data.used ? null : "hidden"}`}>FÖRBRUKAD</p>
              </>
            )}
          </div>
          <div className="bg-red-200 relative w-[100%] h-0 pb-[100%] rounded-t-2xl z-0">
            {useClicked ? null : (
              <Image
                src={eventImage}
                alt="Picture of the event"
                layout="fill"
                priority
                objectFit="cover"
                className="rounded-t-2xl hidden"
              />
            )}
          </div>
          <div className="p-4 rounded-b-2xl flex flex-col items-center bg-white">
            <p className="font-steelfish text-4xl">{formattedName}</p>
            <p className="font-appareo">{eventDetails.eventDate}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { eventName, orderId } = params;

  const ticket = await getTicket(eventName, orderId);
  const event = await getEvent(eventName);

  return {
    props: { ticketDetails: ticket, eventDetails: event }, // will be passed to the page component as props
  };
};
