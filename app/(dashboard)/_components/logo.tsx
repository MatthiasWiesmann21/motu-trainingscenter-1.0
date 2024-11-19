"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import axios from "axios";
import { useEffect } from "react";

interface LogoProps {
  imageUrl: string;
  imageUrlDark: string;
  link: string;
}

export const Logo = ({ imageUrl, imageUrlDark, link }: LogoProps) => {
  const { theme } = useTheme();

  const imageUrlNew = theme === "dark" ? imageUrlDark : imageUrl;

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

  return link ? (
    <Link
      target={link ?? ""}
      href={link ?? ""}
      className="flex h-full w-full items-center justify-center"
    >
      <Image
        priority
        height={100}
        width={150}
        alt="logo"
        src={imageUrlNew ?? ""}
        className="max-h-full max-w-full cursor-pointer object-contain"
      />
    </Link>
  ) : (
    <></>
  );
};
