"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Clock8 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import moment from "moment";
import { atcb_action } from "add-to-calendar-button-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/check-language";

interface LinkedLiveEventProps {
  eventId: string;
  ThemeColor: string;
  DarkThemeColor: string;
}

interface LiveEventData {
  id: string;
  title: string;
  imageUrl: string | null;
  startDateTime: string;
  endDateTime: string;
  description: string;
  categoryId: string | null;
  category: {
    name: string;
    colorCode: string;
    textColorCode: string;
  } | null;
}

export const LinkedLiveEvent = ({
  eventId,
  ThemeColor,
  DarkThemeColor,
}: LinkedLiveEventProps) => {
  const [event, setEvent] = useState<LiveEventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const currentLanguage = useLanguage();

  const getThemeColor = () => {
    return theme === "dark" ? DarkThemeColor : ThemeColor;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/live-events/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleCalendarClick = () => {
    if (!event) return;

    const config = {
      name: event.title,
      description: event.description,
      startDate: moment(event.startDateTime).format("YYYY-MM-DD"),
      endDate: moment(event.endDateTime).format("YYYY-MM-DD"),
      startTime: moment(event.startDateTime).format("HH:mm"),
      endTime: moment(event.endDateTime).format("HH:mm"),
      options: ["Apple", "Google", "iCal", "Outlook.com"],
    };

    // @ts-ignore
    atcb_action(config);
  };

  if (isLoading) {
    return (
      <div className="m-4 p-4 h-24 animate-pulse rounded-lg bg-gray-200" />
    );
  }

  if (!event) {
    return null;
  }

  const isLive =
    new Date(event.startDateTime) <= new Date() &&
    new Date(event.endDateTime) >= new Date();

  return (
    <Card className="m-4 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {event.imageUrl && (
          <div className="relative w-full aspect-[16/9] lg:col-span-1 overflow-hidden rounded-md">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
            {isLive && (
              <div className="absolute left-2 top-2 z-10 rounded-md bg-rose-600 px-2 py-1 text-xs font-semibold text-white">
                Live
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col justify-between lg:col-span-3">
          <div className="space-y-2">
            {event.category && (
              <Tooltip>
                <TooltipTrigger>
                  <span
                    style={{
                      borderColor: event.category.colorCode,
                      color: event.category.textColorCode,
                    }}
                    className="line-clamp-1 inline-block rounded-lg border-2 px-2 py-1 mr-1 text-start text-xs"
                  >
                    {event.category.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="whitespace-normal text-sm font-semibold">
                    {event.category.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
            <h3 className="text-lg line-clamp-2 text-start font-semibold">
              {event.title}
            </h3>
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-y-4 xl:gap-y-0">
              <div className="flex flex-col xl:flex-row xl:items-center gap-y-2 xl:gap-x-6 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-x-2">
                  <Clock className="h-4 w-4" style={{ color: getThemeColor() }}/>
                  <span>
                    {`Starts: ${moment(event.startDateTime).format("DD-MM-YY HH:mm")}`}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <Clock8 className="h-4 w-4" style={{ color: getThemeColor() }}/>
                  <span>
                    {`Ends: ${moment(event.endDateTime).format("DD-MM-YY HH:mm")}`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  onClick={handleCalendarClick}
                  variant="outline"
                  className="h-10 w-10 p-0 transition-all hover:bg-slate-200/20"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <Link href={`/live-event/${event.id}`}>
                  <Button variant="outline" className="h-10 transition-all hover:bg-slate-200/20">
                    {currentLanguage.linkedEvent_button_viewEvent}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};