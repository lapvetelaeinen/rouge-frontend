import { useRouter } from "next/router";
import { EventContext } from "../../contexts/EventContext";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import axios from "axios";

export default function EventPage({ data }) {
  const router = useRouter();
  const passedID = router.query.id;

  const thisEvent = data.find((event) => event.eventId == passedID);

  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";
  const imagePath = BUCKET_URL + thisEvent.image;

  return (
    <div className="min-h-screen bg-neutral-800">
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
        <button className="bg-gradient-to-r from-[#d57187] to-violet-400 w-full fixed bottom-0 h-20 text-3xl font-steelfish text-neutral-800 ">
          KÖP BILJETT FRÅN 199 SEK
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

  return { paths, fallback: false };
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
