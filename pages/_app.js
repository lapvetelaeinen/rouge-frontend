import "../styles/globals.css";
import Layout from "../components/Layout.js";
import { EventContext, EventProvider } from "../contexts/EventContext";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <EventProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </EventProvider>
    </SessionProvider>
  );
}

export default MyApp;
