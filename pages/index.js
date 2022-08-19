import React, { useEffect } from "react";
import { EventContext } from "../contexts/EventContext";
import { useContext } from "react";
import Head from "next/head";
import Calendar from "../components/Calendar";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import axios from "axios";
import EventCard from "../components/EventCard";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Home({ isMobileView, posts }) {
  const { events, saveEvents } = useContext(EventContext);
  const { data, error } = useSWR("/api/events", fetcher);

  // if (error) return "An error has occurred.";
  // if (!data) return "Loading...";
  console.log(error);
  console.log(events);

  saveEvents(data);

  // console.log("THIS IS THE STATUS: ", status);

  function getPDF() {
    return axios.get("/api/pdf", {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
    });
  }

  console.log("MOBILE??? ", isMobileView);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-neutral-800 min-h-[100vh]">
        <div className="relative w-full h-full">
          <div className="absolute bg-neutral-800 bg-opacity-50 w-full h-full flex justify-center items-center text-violet-300 text-[60px] font-steelfish text-center">
            <h1>
              NATTKLUBBEN
              <br />
              NÄRA
              <br />
              STUDENTERNA!
            </h1>
          </div>
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
        <div className="pt-10 md:px-40">
          <h2 className="font-steelfish text-[100px] text-[#d57187] pl-4 pb-4">
            Schema <p className="inline text-5xl pl-6">🥳</p>
          </h2>

          <Calendar />
        </div>
        {data ? (
          <div className="pt-10 md:pl-40" onClick={() => console.log(events)}>
            <h2
              id="tickets"
              className="font-steelfish text-[100px] text-[#d57187] pl-4 pb-4"
            >
              Biljetter <p className="inline text-5xl pl-6">🎟️</p>
            </h2>
            <div className={styles.mediaScroller}>
              {data.map((event) => (
                <EventCard
                  key={event.eventId}
                  id={event.eventId}
                  event={event}
                />
              ))}
            </div>
          </div>
        ) : null}
        {/* <div className="pt-10 md:pl-40">
          <h2 className="font-steelfish text-[100px] text-[#d57187] pl-4 pb-4">
            Följ oss! <p className="inline text-5xl pl-6">🎟️</p>
          </h2>
        </div> */}
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
