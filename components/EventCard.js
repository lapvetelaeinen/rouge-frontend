import { useRouter } from "next/router.js";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Discovery } from "aws-sdk";

function EventCard({ event }) {
  const router = useRouter();
  //   const [eventImage, setEventImage] = useState();

  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";
  const eventImage = BUCKET_URL + event.image;

  //   useEffect(() => {
  //     async function getImageFromStorage() {
  //       try {
  //         const signedURL = await Storage.get(post.image); // get key from Storage.list
  //         console.log("Found Image:", signedURL);
  //         // @ts-ignore
  //         setPostImage(signedURL);
  //       } catch (error) {
  //         console.log("No image found.");
  //       }
  //     }

  //     getImageFromStorage();
  //   }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    // <div className="pl-4" onClick={() => router.push(`/post/${post.id}`)}>
    //   <div className="relative drop-shadow-xl">
    //     {event.image && eventImage && (
    //       <Image
    //         src={eventImage}
    //         alt=""
    //         height={400}
    //         width={400}
    //         className="rounded-md"
    //         priority
    //       />
    //     )}
    //     <div className="absolute bottom-8 w-full bg-violet-200 p-2 flex justify-between px-3">
    //       <div className="text-neutral-900">
    //         <h2 className="font-steelfish text-4xl">{event.title}</h2>
    //         <p className="font-appareo">{event.date}</p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div
      className="bg-neutral-100 mr-4 rounded-3xl max-w-[400px]"
      onClick={() => router.push(`/events/${event.eventName}`)}
    >
      <Image
        src={eventImage}
        alt=""
        className="rounded-t-3xl"
        priority
        height={400}
        width={400}
      />

      <h2 className="text-5xl font-steelfish text-center text-neutral-800 pt-2">
      
        {event.eventName.split("_")[0].replace("-", " ").toUpperCase()}
      </h2>
      <p className="font-appareo text-center pt-2 pb-4 text-neutral-600">
        {event.eventDate}
      </p>
    </div>
  );
}

export default EventCard;
