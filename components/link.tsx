"use client";

import axios from "axios";
import { useEffect } from "react";

const Link = () => {
  const fetchData = async () => {
    const response = await axios.get("/api/containers");
    const data = await response.data;
    setFavicon(data?.icon);
  };

  const setFavicon = (faviconUrl: string) => {
    let link: HTMLLinkElement | null =
      document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return null;
};

export default Link;
