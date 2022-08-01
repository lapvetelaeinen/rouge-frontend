import React, { useEffect } from "react";
import { EventContext } from "../contexts/EventContext";
import { useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import Calendar from "../components/Calendar";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import axios from "axios";
import EventCard from "../components/EventCard";
import { getSession } from "next-auth/react";
import { useSession } from "next-auth/react";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Home() {
  // const { session, loading } = useSession();
  const { data: session, status } = useSession();
  // see if possible to save events in context
  const { events, saveEvents } = useContext(EventContext);
  const { data, error } = useSWR("/api/events", fetcher);

  if (error) return "An error has occurred.";
  if (!data) return "Loading...";
  console.log(error);
  console.log(events);

  saveEvents(data);

  console.log("THIS IS THE STATUS: ", status);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-neutral-800 min-h-[100vh]">
        {/* {!session && (
          <>
            <h1>You are not signed in</h1>
            <button onClick={signIn}>Sign in</button>
          </>
        )}

        {session && (
          <>
            <h1>Hello {session.user.email}</h1>
            <button onClick={signOut}>Sign out</button>
          </>
        )} */}
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATnSURBVO3BQY4cSRIEQdNA/f/Lun30UwCJ9GpyuCaCP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0yUtAfpOaJ4DcqJmATGomIJOaGyBPqJmA/CY1b5xULTqpWnRSteiTZWo2AXkCyI2aCcgNkBsgk5pJzQ2QJ9RsArLppGrRSdWik6pFn3wZkCfUPAHkRs2NmgnIpGYC8gSQbwLyhJpvOqladFK16KRq0Sf/54BMaiYgN2omIDdqJiD/kpOqRSdVi06qFn3yjwMyqZnU3Ki5AfIEkEnNv+SkatFJ1aKTqkWffJmavwmQGzU3QCY1bwCZ1Dyh5m9yUrXopGrRSdWiT5YB+ZPUTEAmNROQGyCTmgnIpGYCMql5A8jf7KRq0UnVopOqRZ+8pOZvpuZPUjMBmdTcqPkvOaladFK16KRqEf7IC0AmNROQTWr+JCBvqJmATGomIJvUfNNJ1aKTqkUnVYs+WQbkCTUTkEnNBORGzQRkUnMD5EbNG0AmNROQN9Q8AWRS88ZJ1aKTqkUnVYs+WaZmAnIDZFIzAdkEZFLzBJBJzQRkUjOpmYBMap4AMgGZ1ExAJjWbTqoWnVQtOqlahD/yApAbNU8AmdRMQJ5QMwF5Qs1vAnKjZgJyo+YGyKTmjZOqRSdVi06qFn3yy4A8AWRS84aaCcikZgKySc0TaiYgk5obIDdqNp1ULTqpWnRStQh/5AUgk5oJyKTmDSBPqJmATGp+E5A31ExAbtRMQG7UvHFSteikatFJ1SL8kb8YkBs1E5A31NwAuVHzBJBJzQRkUjMBuVHzm06qFp1ULTqpWvTJlwF5Qs2kZgIyAZnU3ACZ1NwAmdT8JjWbgExqNp1ULTqpWnRSteiTX6bmCSCTmhsgk5obIJOaSc0EZFIzAZnUTEAmNROQSc0EZFJzA2RS800nVYtOqhadVC365CUgk5obIE+omYBMam6ATGomIBOQGzUTkEnNBOQJNROQSc0E5EbNDZBJzRsnVYtOqhadVC3CH3kByKTmBsik5gbIpGYCMqmZgNyomYA8oeYNIJOaGyBPqJmATGo2nVQtOqladFK16JMvA3ID5EbNjZoJyKRmAvKEmgnINwGZ1ExqJiCTmhs133RSteikatFJ1aJPfpmaCcikZgJyo+YGyBNqJiA3QG7UvAHkCSA3ar7ppGrRSdWik6pF+CP/YUBu1PxJQJ5Q8wSQSc0TQCY1b5xULTqpWnRSteiTl4D8JjWTmhsgk5oJyKTmBshvAjKpuQEyqZmATGo2nVQtOqladFK16JNlajYBuQEyqZnUvAFkUrMJyI2a/5KTqkUnVYtOqhZ98mVAnlDzBpAbNZOaGzUTkCfUPAHkDTUTkEnNN51ULTqpWnRSteiT/3NAJjUTkEnNE0AmNZOaCcikZgIyqZmATGomIDdq3jipWnRSteikatEn/zg1N2omIJOaCcgTap5QMwGZ1ExA3lCz6aRq0UnVopOqRZ98mZpvUnMDZFLzhpongLyhZgJyo+ZPOqladFK16KRq0SfLgPwmIJOaGyCTmhsgN2omIJOab1JzA2RS800nVYtOqhadVC3CH6laclK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC36H8tnVSbseDWkAAAAAElFTkSuQmCC"
          width={500}
          height={500}
        />

        <div className="relative w-full h-full">
          <div className="absolute bg-neutral-800 bg-opacity-50 w-full h-full flex justify-center items-center text-violet-300 text-[60px] font-steelfish text-center">
            <h1>
              NATTKLUBBEN
              <br />
              NÄRA
              <br />
              STUDENTERNA
            </h1>
          </div>
          <video src="/mobile-hero.mp4" playsInline autoPlay loop muted />
        </div>
        <div className="pt-10">
          <h2 className="font-steelfish text-[100px] text-[#d57187] pl-4 pb-4">
            Schema <p className="inline text-5xl pl-6">🥳</p>
          </h2>

          <Calendar />
        </div>
        <div className="pt-10" onClick={() => console.log(events)}>
          <h2 className="font-steelfish text-[100px] text-[#d57187] pl-4 pb-4">
            Biljetter <p className="inline text-5xl pl-6">🎟️</p>
          </h2>
          <div className={styles.mediaScroller}>
            {data.map((event) => (
              <EventCard key={event.eventId} id={event.eventId} event={event} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
