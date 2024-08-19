"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, PlayCircle } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";
import { CategoryItemCard } from "@/app/(dashboard)/(routes)/live-event/_components/category-item-card";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import ClubyteLoader from "./ui/clubyte-loader";

interface EventsCardProps {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  categoryColorCode: string;
  startDateTime: Date | null | any;
  endDateTime: Date | null | any;
  color: string;
  ThemOutlineColor: string;
  DarkThemeOutlineColor: string;
}

export const EventCard = ({
  id,
  title,
  imageUrl,
  category,
  categoryColorCode,
  startDateTime,
  endDateTime,
  color,
  ThemOutlineColor,
  DarkThemeOutlineColor,
}: EventsCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const isLive =
    new Date(startDateTime) <= new Date() &&
    new Date(
      new Date(endDateTime)?.setMinutes(new Date(endDateTime)?.getMinutes() + 1)
    ) >= new Date();

  const getBorderColor = () => {
    return theme === "dark" ? DarkThemeOutlineColor : ThemOutlineColor;
  };

  return (
    <TooltipProvider>
      <Link
        href={`/live-event/${id}`}
        className="rounded-lg border-2 transition duration-500 ease-in-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          borderColor: isHovered ? getBorderColor() : "transparent",
        }}
      >
        <div className="group h-full overflow-hidden rounded-lg bg-slate-100/60 p-2 transition hover:shadow-sm dark:border-[#1f182b] dark:bg-[#0c0319]">
          <div
            className={cn(
              "relative aspect-video w-full overflow-hidden rounded-md",
              isLive && "border-2 border-rose-500"
            )}
          >
            {isLive && (
              <p className="absolute left-2 top-2 z-10 flex rounded-md bg-rose-600 p-1 text-white dark:bg-rose-600 dark:text-white">
                Live
                <PlayCircle className="pl-1" />
              </p>
            )}
            {/* Show a placeholder or spinner while the image is loading */}
            {isLoading && (
              <div className="flex items-center justify-center h-full w-full bg-gray-200 dark:bg-gray-700 animate-pulse">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                {theme === "dark" ? (
                    <ClubyteLoader className="w-64 h-64" theme="dark" color="0c0319" />
                  ) : (
                    <ClubyteLoader className="w-64 h-64" theme="light" color="f7f9fb" />
                  )}
                </span>
              </div>
            )}
            <Image
              fill
              className={`rounded object-cover transition-opacity duration-500 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              alt={title}
              src={imageUrl}
              onLoadingComplete={() => setIsLoading(false)}
            />
          </div>
          <div className="mt-3 p-2">
            <div>
              <CategoryItemCard
                label={category}
                colorCode={categoryColorCode}
              />
            </div>
            <Tooltip>
              <TooltipTrigger>
                <div className="line-clamp-2 py-2 text-start text-sm font-medium md:text-base">
                  {title}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="whitespace-normal text-sm font-medium">
                  {title}
                </div>
              </TooltipContent>
            </Tooltip>
            <p className="text-[12px] text-gray-500">{`Starts: ${moment(
              startDateTime
            )?.format("DD-MM-YY HH:mm")}`}</p>
            <p className="text-[12px] text-gray-500">{`Ends: ${moment(
              endDateTime
            )?.format("DD-MM-YY HH:mm")}`}</p>
          </div>
        </div>
      </Link>
    </TooltipProvider>
  );
};
