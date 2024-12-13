"use client";

import { useLanguage } from "@/lib/check-language";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";
import { Separator } from "./ui/separator";
import { Clock, GraduationCap } from "lucide-react";
import { formatDuration } from "@/lib/formatDuration";
import { useTheme } from "next-themes";

interface PreviewProps {
  value: string;
  duration: string;
  level: string;
  ThemeColor: string;
  DarkThemeColor: string;
}

export const Preview = ({ value, duration, level, ThemeColor, DarkThemeColor }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const { theme } = useTheme();
  const currentLanguage = useLanguage();

  const getThemeColor = () => {
    if (theme === "dark") {
      return DarkThemeColor;
    }
    return ThemeColor;
  };

  return (
    <div className="mt-4 rounded-lg border-2 bg-white pt-2 dark:bg-[#0c0319]">
      <span className="ml-4 text-sm font-bold">
        {currentLanguage.chapter_aboutcourse_title}
      </span>
      <div className="mx-4 mt-2 grid grid-cols-2 text-sm font-bold items-center">
        {duration && (
          <div className="flex items-center my-2">
            <Clock
              className="h-5 w-5" // ensure fixed width and height here as well
              style={{ color: getThemeColor() }}
            />
            <span className="ml-1 text-xs">
              {formatDuration(duration.toString())}
            </span>
          </div>
        )}
        {level && (
          <div className="flex items-center my-2">
            <GraduationCap
              className="h-5 w-5" // fixed size for GraduationCap
              style={{ color: getThemeColor() }}
            />
            <span className="ml-1 text-xs">
              {level || currentLanguage.course_card_no_level}
            </span>
          </div>
        )}
      </div>
      <Separator />
      <span className="text-gray-500">
        <ReactQuill theme="bubble" value={value} readOnly />
      </span>
    </div>
  );
};
