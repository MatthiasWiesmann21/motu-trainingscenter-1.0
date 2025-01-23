"use client";
import { useState, useEffect, use } from "react";
import { Categories } from "./categories";
import { useSession } from "next-auth/react";
import EventFilterSidebar from "./filter-sidebar";
import { PastandFuture } from "./past&future";
import { useRouter } from "next/navigation";
import { EventsList } from "@/components/events-list ";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useLanguage } from "@/lib/check-language";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";

interface LiveEventWrapperProps {
  liveEvents: any;
  categories: any;
  searchParams: any;
  container: any;
  profileRole: string;
}

export const LiveEventWrapper = ({
  liveEvents,
  categories,
  searchParams,
  container,
  profileRole,
}: LiveEventWrapperProps) => {
  const { data: session, status } = useSession();
  const [liveEvent, setLiveEvent] = useState(liveEvents || []);
  const router = useRouter();
  const currentLanguage = useLanguage();
  const { onOpen } = useModal();

  const getLiveEvents = async () => {
    const response = await axios?.get(
      `/api/liveEvent?categoryId=${searchParams?.categoryId || ""}&title=${
        searchParams?.title || ""
      }&state=${searchParams?.state}`
    );
    setLiveEvent(response?.data);
  };

  useEffect(() => {
    getLiveEvents();
  }, [searchParams]);

  if (status === "loading") {
    return <div>Loading...</div>; // Optionally show a loading state while fetching session
  }

  if (!session) {
    router.push("/auth/sign-in");
    return <></>; // Ensure a valid JSX element is always returned
  }

  const userId = session.user?.id;

  return (
    <div className="space-y-4 p-4">
      <div className="mr-1 flex justify-between">
        <div className="flex">
          <PastandFuture
            ThemeColor={container?.ThemeColor!}
            DarkThemeColor={container?.DarkThemeColor!}
          />
          {profileRole === "ADMIN" || profileRole === "CLIENT ADMIN" && (
            <Button
              className="border-2"
              variant="outline"
              onClick={() => onOpen("createLiveEvent")}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              {currentLanguage.liveEvent_createEvent_button_text}
            </Button>
          )}
        </div>
        <div>
          <EventFilterSidebar
            liveEvents={liveEvent}
            setLiveEvent={setLiveEvent}
            PrimaryButtonColor={container?.PrimaryButtonColor!}
            DarkPrimaryButtonColor={container?.DarkPrimaryButtonColor!}
            categories={undefined}
            searchParams={undefined}
          />
        </div>
      </div>
      <div className="block lg:hidden mb-2 max-w-3xl mx-auto lg:ml-auto lg:mr-0">
        <Link
          className="w-full h-8 flex items-center justify-center rounded-full border-2 text-xs transition duration-300 ease-in-out hover:bg-slate-200 dark:hover:bg-slate-700"
          href={"/live-event/favourite-events"}
        >
          {currentLanguage.dashboard_eventTable_viewFavoriteEvents_button_text}
        </Link>
      </div>
      <div className="flex w-full">
        <div className="w-full lg:w-[85%]">
          <Categories
            items={categories}
            ThemeColor={container?.ThemeColor!}
            DarkThemeColor={container?.DarkThemeColor!}
          />
        </div>

        <div className="hidden lg:flex w-[15%] items-center justify-center">
          <Link
            className="w-full h-8 flex items-center justify-center rounded-full border-2 text-xs transition duration-300 ease-in-out hover:bg-slate-200 dark:hover:bg-slate-700"
            href={"/live-event/favourite-events"}
          >
            {currentLanguage.dashboard_eventTable_viewFavoriteEvents_button_text}
          </Link>
        </div>
      </div>
      <EventsList
        items={liveEvent?.map((each: any) => ({
          ...each,
          color: container?.navDarkBackgroundColor,
        }))}
        ThemeColor={container?.ThemeColor!}
        DarkThemeColor={container?.DarkThemeColor!}
        getLiveEvents={getLiveEvents}
      />
    </div>
  );
};

export default LiveEventWrapper;