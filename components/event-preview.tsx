"use client";

import { useLanguage } from "@/lib/check-language";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
}

export const EventPreview = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const currentLanguage = useLanguage();

  return (
    <div
      className="mt-4 rounded-lg bg-slate-100/60 dark:bg-[#0c0319] p-4"
    >
      <span className="ml-4 text-sm font-bold">
        {currentLanguage.chapter_aboutevent_title}
      </span>
      <span className="text-black dark:text-gray-300">
        <ReactQuill theme="bubble" value={value} readOnly />
      </span>
    </div>
  );
};
