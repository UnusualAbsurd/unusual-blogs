import "../styles/globals.css";
import "react-notifications/lib/notifications.css";

import { NotificationContainer } from "react-notifications";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NotificationContainer />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
