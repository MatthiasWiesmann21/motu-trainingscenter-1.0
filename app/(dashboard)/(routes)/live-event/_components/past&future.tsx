"use client";

import { useLanguage } from "@/lib/check-language";
import axios from "axios";
import { useTheme } from "next-themes";
import { useState } from "react";

export const PastandFuture = ({
  setLiveEvent,
  getEvent,
  liveEvent,
  ThemeOutlineColor,
  DarkThemeOutlineColor,
}: {
  setLiveEvent: any;
  getEvent: any;
  liveEvent: any[];
  ThemeOutlineColor: string;
  DarkThemeOutlineColor: string;
}) => {
  const currentLanguage = useLanguage();
  const [state, setState] = useState("past");
  const [isHoveredFuture, setIsHoveredFuture] = useState(false);
  const [isHoveredPast, setIsHoveredPast] = useState(false);
  const { theme } = useTheme();

  const getThemeColor = () => {
    return theme === "dark" ? DarkThemeOutlineColor : ThemeOutlineColor;
  };

  return (
    <div className="flex items-center justify-between">
      <div
        onClick={async () => {
          const response = await axios?.get(`/api/liveEvent`);
          setLiveEvent(
            response?.data?.filter(
              (each: any) => new Date(each?.startDateTime) > new Date()
            )
          );
          setState("future");
        }}
        onMouseEnter={() => setIsHoveredFuture(true)}
        onMouseLeave={() => setIsHoveredFuture(false)}
        className={`border-1 font-semibold mr-2 flex cursor-pointer items-center justify-center p-1 text-gray-600 dark:text-white transition duration-500 ease-in-out ${
          state === "future" ? "border-b-2 text-black" : ""
        }`}
        style={{
          borderColor:
            state === "future" || isHoveredFuture ? getThemeColor() : "transparent",
        }}
      >
        {currentLanguage.live_event_futureAndPast_button_text_future}
      </div>
      <div
        onClick={async () => {
          const response = await axios?.get(`/api/liveEvent`);
          setLiveEvent(
            response?.data?.filter(
              (each: any) => new Date(each?.startDateTime) < new Date()
            )
          );
          setState("past");
        }}
        onMouseEnter={() => setIsHoveredPast(true)}
        onMouseLeave={() => setIsHoveredPast(false)}
        className={`border-1 mr-2 font-semibold flex cursor-pointer items-center justify-center p-1 text-gray-600 dark:text-white transition duration-500 ease-in-out ${
          state === "past" ? "border-b-2 text-black" : ""
        }`}
        style={{
          borderColor:
            state === "past" || isHoveredPast ? getThemeColor() : "transparent",
        }}
      >
        {currentLanguage.live_event_futureAndPast_button_text_past}
      </div>
    </div>
  );
};
