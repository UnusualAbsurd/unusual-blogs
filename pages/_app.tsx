import "../styles/globals.css";
import type { AppProps } from "next/app";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NotificationContainer />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
