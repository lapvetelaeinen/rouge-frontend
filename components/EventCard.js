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

  const removeDash = event.eventName.replace(/-/g, " ").toUpperCase();
  const formattedName = removeDash
    .replace(/_AA_/g, "Å")
    .replace(/_AE_/g, "Ä")
    .replace(/_OE_/g, "Ö");

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
    <>


    <div className="shadow-lg rounded-2xl w-[250px] md:w-[300px] mr-10" onClick={() => router.push(`/events/${event.eventName}`)}>
<div className="bg-red-200 relative w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-2xl z-0">

  <Image
    src={eventImage}
    alt="Picture of the event"
    layout="fill"
    priority
    objectFit="cover"
    className="rounded-t-2xl hidden"
  />
</div>
<div className="p-4 rounded-b-2xl flex flex-col items-center bg-white">
  <p className="font-steelfish text-4xl">{formattedName}</p>
  <p className="font-appareo">{event.eventDate}</p>
</div>
</div>
</>
  );
}

export default EventCard;
