import { useRouter } from "next/router";
import { EventContext } from "../../contexts/EventContext";
import { useContext } from "react";
import Image from "next/image";

export default function EventPage() {
  const { events } = useContext(EventContext);
  const router = useRouter();
  const eventId = router.query.eventId;

  const event = events.find((element) => element.eventId == eventId);

  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";
  const eventImage = BUCKET_URL + event.image;

  return (
    <div>
      <h1>{event.title}</h1>
      <Image
        src={eventImage}
        alt=""
        className=""
        priority
        height={400}
        width={400}
      />
      <p>{event.description}</p>
    </div>
  );
}
