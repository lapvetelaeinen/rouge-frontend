import "../styles/globals.css";
import Layout from "../components/Layout.js";
import { EventContext, EventProvider } from "../contexts/EventContext";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <EventProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </EventProvider>
  );
}

export default MyApp;
