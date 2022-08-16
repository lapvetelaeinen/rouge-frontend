import "../styles/globals.css";
import Layout from "../components/Layout.js";
import Loader from "../components/Loader";
import { useState } from "react";
import Router from "next/router";
import { EventContext, EventProvider } from "../contexts/EventContext";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [loading, setLoading] = useState(false);
  Router.events.on("routeChangeStart", (url) => {
    setLoading(true);
    document.body.style.overflow = "hidden";
  });
  Router.events.on("routeChangeComplete", (url) => {
    setLoading(false);
    document.body.style.overflow = "auto";
  });
  return (
    <EventProvider>
      <Layout>
        {loading && <Loader />}

        <Component {...pageProps} />
      </Layout>
    </EventProvider>
  );
}

export default MyApp;
