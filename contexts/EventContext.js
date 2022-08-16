import { createContext, useState } from "react";
import useSWR from "swr";
import axios from "axios";

const EventContext = createContext();

function EventProvider({ children }) {
  const [events, setEvents] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  function saveEvents(data) {
    setEvents(data);
  }

  async function getEvent(eventId) {
    const response = await fetch("/api/events");
    const data = await response.json();
    // const found = awaitdata.find((element) => element == eventId);
    return data;
  }

  return (
    <EventContext.Provider
      value={{
        events,
        saveEvents,
        getEvent,
        currentOrder,
        setCurrentOrder,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export { EventProvider, EventContext };
