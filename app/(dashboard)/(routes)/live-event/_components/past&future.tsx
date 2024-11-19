"use client";

import { useLanguage } from "@/lib/check-language";
import { updateQueryParams } from "@/utils/utils";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const PastandFuture = ({
  ThemeColor,
  DarkThemeColor,
}: {
  ThemeColor: string;
  DarkThemeColor: string;
}) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams?.get("state") || "";
  const currentLanguage = useLanguage();
  const [isHoveredFuture, setIsHoveredFuture] = useState(false);
  const [isHoveredPast, setIsHoveredPast] = useState(false);
  const { theme } = useTheme();

  const getThemeColor = () => {
    return theme === "dark" ? DarkThemeColor : ThemeColor;
  };

  return (
    <div className="flex items-center justify-between">
      <div
        onClick={async () => updateQueryParams({ state: "" }, replace)}
        onMouseEnter={() => setIsHoveredFuture(true)}
        onMouseLeave={() => setIsHoveredFuture(false)}
        className={`border-1 mr-2 flex cursor-pointer items-center justify-center p-1 text-sm font-semibold text-gray-600 transition duration-500 ease-in-out dark:text-white ${
          state === "" ? "border-b-2 text-black" : ""
        }`}
        style={{
          borderColor:
            state === "" || isHoveredFuture ? getThemeColor() : "transparent",
        }}
      >
        {currentLanguage.live_event_futureAndPast_button_text_all}
      </div>
      <div
        onClick={async () => updateQueryParams({ state: "future" }, replace)}
        onMouseEnter={() => setIsHoveredFuture(true)}
        onMouseLeave={() => setIsHoveredFuture(false)}
        className={`border-1 mr-2 flex cursor-pointer items-center justify-center p-1 text-sm font-semibold text-gray-600 transition duration-500 ease-in-out dark:text-white ${
          state === "future" ? "border-b-2 text-black" : ""
        }`}
        style={{
          borderColor:
            state === "future" || isHoveredFuture
              ? getThemeColor()
              : "transparent",
        }}
      >
        {currentLanguage.live_event_futureAndPast_button_text_future}
      </div>
      <div
        onClick={async () => updateQueryParams({ state: "past" }, replace)}
        onMouseEnter={() => setIsHoveredPast(true)}
        onMouseLeave={() => setIsHoveredPast(false)}
        className={`border-1 mr-2 flex cursor-pointer items-center justify-center p-1 text-sm font-semibold text-gray-600 transition duration-500 ease-in-out dark:text-white ${
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
