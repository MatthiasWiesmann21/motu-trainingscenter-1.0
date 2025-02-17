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
import { useSession } from "next-auth/react"; // Use NextAuth's useSession hook
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/lib/check-language";
import { Container } from "@prisma/client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { DateandTime } from "./date&time";

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
  const { data: session } = useSession(); // Get session data from NextAuth
  const currentLanguage = useLanguage();
  const [isViewAllHovered, setIsViewAllHovered] = useState(false);
  const { theme } = useTheme();

  const getPrimaryButtonColor = () => {
    return theme === "dark" ? DarkPrimaryButtonColor : PrimaryButtonColor;
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
          className="flex mt-1 ml-2 items-center justify-center rounded-full border-2 bg-transparent text-gray-700 transition duration-300 ease-in-out"
          variant="default"
          size="sm"
        >
          <SlidersHorizontal
            className="pr-1 text-gray-800 dark:text-white duration-300 ease-in-out"
            size={24}
            style={{
              color: isViewAllHovered ? "#ffffff" : "",
            }}
          />
          <p
            style={{
              color: isViewAllHovered ? "#ffffff" : "",
            }}
            className="text-gray-800 dark:text-white duration-300 ease-in-out hidden sm:block"
          >
            {currentLanguage.live_event_filter_button_text}
          </p>
        </Button>
      </SheetTrigger>
      <SheetContent className="p-5 pt-12 flex flex-col items-center">
        <DateandTime
          setLiveEvent={setLiveEvent}
          getEvent={{
            userId: session?.user?.id, // Access userId from session
            ...searchParams,
            containerId: session?.user?.profile?.containerId,
          }}
          liveEvent={liveEvents}
        />
      </SheetContent>
    </Sheet>
  );
};

export default EventFilterSidebar;