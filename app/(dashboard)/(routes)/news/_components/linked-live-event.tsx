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

interface LinkedLiveEventProps {
  eventId: string;
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

export const LinkedLiveEvent = ({ eventId }: LinkedLiveEventProps) => {
  const [event, setEvent] = useState<LiveEventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    return <div className="h-24 animate-pulse rounded-lg bg-gray-200" />;
  }

  if (!event) {
    return null;
  }

  const isLive =
    new Date(event.startDateTime) <= new Date() &&
    new Date(event.endDateTime) >= new Date();

  return (
    <Card className="m-4 p-4">
      <div className="flex gap-6">
        {event.imageUrl && (
          <div className="relative h-[150px] w-[200px] flex-shrink-0 overflow-hidden rounded-md">
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
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-2">
            {event.category && (
              <Tooltip>
                <TooltipTrigger>
                  <span
                    style={{
                      borderColor: event.category.colorCode,
                      color: event.category.textColorCode,
                    }}
                    className="mr-1 line-clamp-1 rounded-lg border-2 px-2 py-1 text-start text-xs"
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
            <h3 className="line-clamp-2 text-start text-lg font-semibold">
              {event.title}
            </h3>
            <div className="flex flex-col gap-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex flex-col gap-y-2 px-1">
                <div className="flex flex-row items-center gap-x-2">
                  <Clock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <p className="text-sm font-medium">
                    {`Starts: ${moment(event.startDateTime).format("DD-MM-YY HH:mm")}`}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                  <Clock8 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <p className="text-sm font-medium">
                    {`Ends: ${moment(event.endDateTime).format("DD-MM-YY HH:mm")}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleCalendarClick}
              variant="outline"
              className="h-10 w-10 p-0"
            >
              <Calendar width={16} height={16} />
            </Button>
            <Link href={`/live-event/${event.id}`}>
              <Button variant="outline" className="gap-2">
                View Event
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};