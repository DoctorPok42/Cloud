import "../styles/globals.scss";

import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import { useEffect, useState } from "react";

const progress = new ProgressBar({
  size: 4,
  color: "#4488dc",
  className: "bar-of-progress",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

const MyApp = ({ Component, pageProps }: any) => {
  const [isReduced, setIsReduced] = useState<boolean>(false);

  useEffect(() => {
    const isReducedLoc = localStorage.getItem("isReduced");
    if (isReducedLoc) {
      setIsReduced(JSON.parse(isReducedLoc));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isReduced", JSON.stringify(isReduced));
  }, [isReduced]);

  return <Component {...pageProps} isReduced={isReduced} setIsReduced={setIsReduced} />;
};

export default MyApp;
