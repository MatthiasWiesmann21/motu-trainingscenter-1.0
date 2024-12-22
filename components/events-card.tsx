"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Info,
  MoreVertical,
  Pencil,
  PlayCircle,
  Share2,
  Star,
  Trash,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import ClubyteLoader from "./ui/clubyte-loader";
import { CategoryItemCard } from "@/app/(dashboard)/(routes)/live-event/_components/category-item-card";
import { Button } from "./ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { DescriptionModal } from "./modals/description-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ConfirmModal } from "./modals/confirm-modal";
import { useLanguage } from "@/lib/check-language";
import { useIsAdmin, useIsClientAdmin } from "@/lib/roleCheck";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { atcb_action } from "add-to-calendar-button-react";
import { ShareLinkModal } from "./modals/share-link-modal";
import { EventInfoModal } from "./modals/event-info-modal";
interface EventsCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  categoryColorCode: string;
  startDateTime: Date | null | any;
  endDateTime: Date | null | any;
  ThemeColor: string;
  DarkThemeColor: string;
  currentFavorite: boolean;
  getLiveEvents: any;
}

export const EventCard = ({
  id,
  title,
  description,
  imageUrl,
  category,
  categoryColorCode,
  startDateTime,
  endDateTime,
  ThemeColor,
  DarkThemeColor,
  currentFavorite,
  getLiveEvents,
}: EventsCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const { onOpen } = useModal();
  const currentLanguage = useLanguage();
  const isAdmin = useIsAdmin();
  const isClientAdmin = useIsClientAdmin();
  const router = useRouter();

  const canAccess = isAdmin || isClientAdmin;

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/liveEvent/${id}`);

      toast.success("Event deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const isLive =
    new Date(startDateTime) <= new Date() &&
    new Date(
      new Date(endDateTime)?.setMinutes(new Date(endDateTime)?.getMinutes() + 1)
    ) >= new Date();

  const getBorderColor = () => {
    return theme === "dark" ? DarkThemeColor : ThemeColor;
  };

  const handleCalendarClick = () => {
    const config: any = {
      name: title,
      description: description,
      startDate: moment(startDateTime).format("YYYY-MM-DD"),
      endDate: moment(endDateTime).format("YYYY-MM-DD"),
      startTime: moment(startDateTime).format("HH:mm"),
      endTime: moment(endDateTime).format("HH:mm"),
      options: ["Apple", "Google", "iCal", "Outlook.com"],
      // timeZone: "America/Los_Angeles",
    };

    atcb_action(config);
  };

  return (
    <TooltipProvider>
      <div
        className="w-full rounded-lg border-2 transition duration-300 ease-in-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          borderColor: isHovered ? getBorderColor() : "",
        }}
      >
        <div className="group h-full overflow-hidden rounded-lg bg-white p-2 transition hover:shadow-lg dark:border-[#1f182b] dark:bg-[#0c0319]">
          {/* Image and Date/Time Section */}
          <Link href={`/live-event/${id}`} className="relateive flex">
            <div className="relative aspect-video w-full overflow-hidden rounded-md md:w-2/3 md:rounded-l-md md:rounded-r-none">
              {isLive && (
                <p className="absolute left-2 top-2 z-10 flex rounded-md bg-rose-600 p-1 text-white dark:bg-rose-600 dark:text-white">
                  Live
                  <PlayCircle className="pl-1" />
                </p>
              )}
              {/* Show a placeholder or spinner while the image is loading */}
              {isLoading && (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {theme === "dark" ? (
                      <ClubyteLoader
                        className="h-64 w-64"
                        theme="dark"
                        color="0c0319"
                      />
                    ) : (
                      <ClubyteLoader
                        className="h-64 w-64"
                        theme="light"
                        color="ffffff"
                      />
                    )}
                  </span>
                </div>
              )}
              <Image
                fill
                className={`h-full w-full object-cover transition-opacity duration-500 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                alt={title}
                src={imageUrl}
                onLoadingComplete={() => setIsLoading(false)}
              />
            </div>
            {/* Date and Time Section */}
            <div className="flex hidden max-h-44 w-1/3 flex-col items-center justify-center bg-slate-100 p-2 py-6 text-center dark:bg-gray-800 md:block md:rounded-l-none md:rounded-r-md">
              <p className="text-xl font-bold">
                {moment(startDateTime).format("DD")}
              </p>
              <p className="text-lg font-semibold">
                {moment(startDateTime).format("MMM")}
              </p>
              <p className="text-sm font-medium">
                {moment(startDateTime).format("YYYY")}
              </p>
              <p className="text-sm font-medium">
                {moment(startDateTime).format("HH:mm")}
              </p>
            </div>
          </Link>
          <div className="mt-3 flex items-center justify-between">
            <div className="mr-2">
              {category && (
                <CategoryItemCard
                  label={category}
                  colorCode={categoryColorCode}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <Star
                size={16}
                fill={!!currentFavorite ? "#FFD700" : "#ffffff00"}
                className="mx-1 h-7 w-7 cursor-pointer rounded-md p-1 transition duration-200 ease-in-out hover:scale-110 hover:bg-slate-200 dark:hover:bg-slate-700"
                style={!!currentFavorite ? { color: "#FFD700" } : {}}
                onClick={async () => {
                  const response = await axios?.post(`/api/favorite/create`, {
                    liveEventId: id,
                  });
                  if (response?.status === 200) getLiveEvents();
                }}
              />
              <ShareLinkModal id={id}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Share2 width={16} height={16} />
                </Button>
              </ShareLinkModal>
              <Button
                onClick={handleCalendarClick}
                variant="ghost"
                className="h-8 w-8 p-0"
                // TODO: add new "add to calendar" component here
              >
                <Calendar width={16} height={16} />
              </Button>
              <EventInfoModal
                description={description}
                title={title}
                startDateTime={startDateTime}
                endDateTime={endDateTime}
              >
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info width={16} height={16} />
                </Button>
              </EventInfoModal>
              {canAccess && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/admin/live-event/${id}`}>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        {currentLanguage.course_card_edit}
                      </DropdownMenuItem>
                    </Link>
                    <ConfirmModal onConfirm={onDelete}>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isLoading}
                        className="flex w-full justify-start p-2"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        {currentLanguage.course_card_delete}
                      </Button>
                    </ConfirmModal>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          {/* Event Title */}
          <Link className="" href={`/live-event/${id}`}>
            <Tooltip>
              <TooltipTrigger>
                <div className="line-clamp-2 py-2 text-start text-sm font-medium md:text-base">
                  {title}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div className="whitespace-normal text-sm font-medium">
                  {title}
                </div>
              </TooltipContent>
            </Tooltip>
            <div className="mt-2 block flex items-center justify-center gap-2 rounded-md bg-slate-100 py-2 text-center dark:bg-gray-800 md:hidden">
              <p className="text-md font-bold">
                {moment(startDateTime).format("DD")}
              </p>
              <p className="text-sm font-medium">
                {moment(startDateTime).format("MMM")}
              </p>
              <p className="text-md font-medium">
                {moment(startDateTime).format("YYYY")}
              </p>
              <p className="text-md font-medium">
                {moment(startDateTime).format("HH:mm")}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </TooltipProvider>
  );
};
