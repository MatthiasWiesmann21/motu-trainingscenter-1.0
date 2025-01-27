"use client";

import { useLanguage } from "@/lib/check-language";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";
import { Separator } from "./ui/separator";
import moment from "moment";
import { Clock, Clock8 } from "lucide-react";
import { useTheme } from "next-themes";

interface PreviewProps {
  value: string;
  startDateTime?: string;
  endDateTime?: string;
  isAdmin: boolean;
  themeColor: string;
  darkThemeColor: string;
}

export const EventPreview = ({
  value,
  isAdmin,
  startDateTime,
  endDateTime,
  themeColor,
  darkThemeColor,
}: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const currentLanguage = useLanguage();
  const { theme } = useTheme();

  const getThemeColor = () => {
    return theme === "dark" ? darkThemeColor : themeColor;
  };

  return (
    <div className="mt-2 rounded-lg border-2 bg-white px-2 py-2 dark:bg-[#0c0319]">
      <span className="text-md ml-1 font-bold">
        {currentLanguage.chapter_aboutevent_title}
      </span>
      {!isAdmin && (
        <div>
          <Separator className="my-2" />
          <div className="my-2 grid grid-cols-2 items-start px-1">
            <div className="flex flex-row items-center gap-x-1">
              <Clock style={{ color: getThemeColor() }} className="h-6 w-6" />
              <p className="text-sm font-medium">{`${currentLanguage.liveEvent_start}: ${moment(
                startDateTime
              )?.format("DD-MM-YY HH:mm")}`}</p>
            </div>
            <div className="flex flex-row items-center gap-x-1">
              <Clock8 style={{ color: getThemeColor() }} className="h-6 w-6" />
              <p className="text-sm font-medium">{`${currentLanguage.liveEvent_end}: ${moment(
                endDateTime
              )?.format("DD-MM-YY HH:mm")}`}</p>
            </div>
          </div>
          <Separator className="my-2" />
        </div>
      )}
      <span className="text-black dark:text-gray-300">
        <ReactQuill theme="bubble" value={value} readOnly />
      </span>
    </div>
  );
};