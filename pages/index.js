import React, { useEffect } from "react";
import { EventContext } from "../contexts/EventContext";
import { useContext } from "react";
import Head from "next/head";
import Calendar from "../components/Calendar";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import axios from "axios";
import EventCard from "../components/EventCard";
import Booking from "../components/Booking";
import { Router } from "next/router";
import { useRouter } from "next/router.js";
import { useState } from "react";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Home({ isMobileView, posts }) {
  const [allEvents, setAllEvents] = useState(null);
  const { events, saveEvents } = useContext(EventContext);
  const { data, error } = useSWR("/api/events", fetcher);




  console.log("nanana ", allEvents);


  const router = useRouter();

  saveEvents(data);


  console.log("MOBILE??? ", isMobileView);

  useEffect(() => {
    if(!allEvents){
      axios.get("https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-events").then(res => setAllEvents(res.data));
      console.log("this is events: ", allEvents);
    } return;

    });

  return (
    <div className={styles.container}>
      <Head>
        <title>Rouge Umeå</title>
        <meta name="description" content="Nattklubben nära studenterna" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-neutral-800 min-h-[100vh]">
        <div className="relative w-full h-full">
          <div className="absolute top-[40%] z-50 w-full text-center">
            {" "}
            <button
              className="bg-[#d57187] text-neutral-800 py-2 px-8 rounded-xl font-steelfish text-[40px] shadow-2xl border-2 border-neutral-700 cursor-pointer hover:bg-violet-300"
              onClick={() => router.push("/#boka")}
            >
              BOKA SITTNING
            </button>
          </div>

          <div className="absolute bg-neutral-800 bg-opacity-50 w-full h-full flex justify-center items-center text-violet-300 text-[40px] font-steelfish text-center"></div>
          {isMobileView ? (
            <video src="/mobile-hero.mp4" playsInline autoPlay loop muted />
          ) : (
            <video
              src="/desktop-hero.mp4"
              playsInline
              autoPlay
              loop
              muted
              className="w-full"
            />
          )}
        </div>
        {/* <div className="pt-10 md:px-40">
          <h2 className="font-steelfish text-[100px] text-[#d57187] pl-4 pb-4">
            Schema <p className="inline text-5xl pl-6">🥳</p>
          </h2>

          <Calendar />
        </div> */}
        {allEvents ? (
          <div
            className="pt-10 md:pl-40 pb-10"
            onClick={() => console.log(events)}
          >
            <h2
              id="tickets"
              className="font-steelfish text-[100px] text-[#d57187] pl-4 pb-4"
            >
              Biljetter <p className="inline text-5xl pl-6">🎟️</p>
            </h2>
            <div className={styles.mediaScroller}>
              {allEvents.map((event) => (
                event.hasTickets === "yes" ?
                <EventCard
                  key={event.eventId}
                  id={event.eventId}
                  event={event}
                /> : null
              ))}
            </div>
          </div>
        ) : null}
        <Booking />
        {/* <h2
          id="tickets"
          className="font-steelfish text-[100px] text-[#d57187] pl-4 pb-4"
        >
          Schema <p className="inline text-5xl pl-6">🥳</p>
        </h2>
        <Calendar /> */}
      </main>
    </div>
  );
}

Home.getInitialProps = async (ctx) => {
  let isMobileView = (
    ctx.req ? ctx.req.headers["user-agent"] : navigator.userAgent
  ).match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i);

  //Returning the isMobileView as a prop to the component for further use.
  return {
    isMobileView: Boolean(isMobileView),
  };
};
