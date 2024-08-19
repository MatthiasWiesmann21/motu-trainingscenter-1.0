"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DateandTime } from "./date&time";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/lib/check-language";
import { Container } from "@prisma/client";
import { useState } from "react";
import { useTheme } from "next-themes";

interface EventFilterSidebarProps {
  liveEvents: any;
  categories: any;
  searchParams: any;
  setLiveEvent: any;
  PrimaryButtonColor: string;
  DarkPrimaryButtonColor: string;
}

const EventFilterSidebar = ({
  liveEvents,
  categories,
  searchParams,
  setLiveEvent,
  PrimaryButtonColor,
  DarkPrimaryButtonColor,
}: EventFilterSidebarProps) => {
  const { userId } = useAuth();
  const currentLanguage = useLanguage();
  const [isViewAllHovered, setIsViewAllHovered] = useState(false);
  const { theme } = useTheme();

  const getPrimaryButtonColor = () => {
    return theme === "dark"
      ? DarkPrimaryButtonColor
      : PrimaryButtonColor;
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          onMouseEnter={() => setIsViewAllHovered(true)}
          onMouseLeave={() => setIsViewAllHovered(false)}
          style={{
            borderColor: getPrimaryButtonColor(),
            backgroundColor: isViewAllHovered ? getPrimaryButtonColor() : "",
          }}
          className="border-5 h-10 w-24 items-center justify-center rounded-full border bg-transparent text-gray-700 transition duration-500 ease-in-out"
          variant="default"
          size="sm"
        >
          <SlidersHorizontal
            className="pr-1 text-gray-800 dark:text-white"
            size={24}
          />
          <p className="text-gray-800 dark:text-white">
            {currentLanguage.live_event_filter_button_text}
          </p>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{currentLanguage.live_event_filter_title}</SheetTitle>
          <SheetDescription>
            {currentLanguage.live_event_filter_description}
          </SheetDescription>
        </SheetHeader>
        <DateandTime
          setLiveEvent={setLiveEvent}
          getEvent={{
            userId,
            ...searchParams,
            containerId: process.env.CONTAINER_ID,
          }}
          liveEvent={liveEvents}
        />
      </SheetContent>
    </Sheet>
  );
};

export default EventFilterSidebar;