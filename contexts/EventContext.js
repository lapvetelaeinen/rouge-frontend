import { createContext, useState } from "react";
import useSWR from "swr";
import axios from "axios";

const EventContext = createContext();

function EventProvider({ children }) {
  const [events, setEvents] = useState(null);

  function saveEvents(data) {
    setEvents(data);
  }

  function getEvent(eventId) {
    const found = events.find((element) => element.eventId == eventId);
    return found;
  }

  return (
    <EventContext.Provider
      value={{
        events,
        saveEvents,
        getEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export { EventProvider, EventContext };
