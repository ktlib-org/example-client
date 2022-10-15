import { useInitialEffect } from "core/react-utils";
import { useState } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  function handleResize() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  useInitialEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  });

  return windowSize;
}

export function setPageInfo(name: string, title: string) {
  const fullTitle = `App - ${title}`;
  const className = `${name}-page`;
  const appElement = window.document.getElementById("app");

  if (appElement.className != className) appElement.className = className;
  if (window.document.title != fullTitle) window.document.title = fullTitle;
}

export function getUrlParams<T>(url: string): T {
  const data = {};
  const convertValue = (v: string) => decodeURIComponent(v.replace(/\+/g, " "));
  const params = url.split("?")[1] || "";
  params.split("&").map((p) => {
    if (p && p.trim() != "") {
      const values = p.split("=");
      data[convertValue(values[0])] = convertValue(values[1]);
    }
  });
  return data as T;
}
