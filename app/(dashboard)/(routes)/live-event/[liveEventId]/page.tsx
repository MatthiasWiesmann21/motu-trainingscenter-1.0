"use client";
import { useSession } from "next-auth/react"; // Use NextAuth's useSession hook
import { redirect, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { VideoPlayer } from "./_components/video-player";
import moment from "moment";
import Chat from "./_components/chat";
import EventModal from "./_components/eventModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { CategoryItem } from "./_components/category-item";
import Love from "./_components/love";
import { EventPreview } from "@/components/event-preview";
import Favorite from "./_components/favorite";
import { useTheme } from "next-themes";
import ClubyteLoader from "@/components/ui/clubyte-loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import toast from "react-hot-toast";
import { useLanguage } from "@/lib/check-language";
import { useIsAdmin, useIsClientAdmin } from "@/lib/roleCheck";
import { getContainer } from "@/actions/get-container";
import { cn } from "@/lib/utils";
import { useContainerData } from "@/hooks/useContainerData";

const LiveEventIdPage = ({ params }: { params: { liveEventId: string } }) => {
  const { theme } = useTheme();
  const { data: session } = useSession(); // Get session data from NextAuth
  const [liveEvent, setLiveEvent] = useState<any>();
  const [category, setCategory] = useState<any>();
  const container = useContainerData();
  const currentLanguage = useLanguage();
  const isAdmin = useIsAdmin();
  const isClientAdmin = useIsClientAdmin();

  const canAccess = isAdmin || isClientAdmin;

  const getLiveEvent = async () => {
    const response = await axios?.get(`/api/liveEvent/${params?.liveEventId}`, {
      params: { liveEventId: params?.liveEventId },
    });
    setLiveEvent(response?.data?.liveEvent);
    setCategory(response?.data?.category);
  };
  const router = useRouter();

  useEffect(() => {
    getLiveEvent();
  }, []);

  if (!session?.user?.id) {
    return redirect("/");
  }

  const onDelete = async () => {
    try {
      await axios.delete(`/api/liveEvent/${params?.liveEventId}`);
      toast.success("Course deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return liveEvent ? (
    <div className={cn("flex flex-col md:flex-row", liveEvent?.isStreamChat && "w-full")}>
      <div className="flex w-full flex-col md:w-2/3">
        <div className="p-4">
          <VideoPlayer
            videoUrl={liveEvent?.videoUrl}
            startDateTime={liveEvent?.startDateTime}
            endDateTime={liveEvent?.endDateTime}
          />
          <EventModal
            liveEventId={liveEvent?.id}
            endDateTime={liveEvent?.endDateTime}
            getLiveEvent={getLiveEvent}
            isEnded={liveEvent?.isEnded}
          />
        </div>
        <div>
          <div className="flex flex-row items-center justify-between p-4">
            <h2 className="mb-2 line-clamp-2 text-lg font-medium">
              {liveEvent?.title}
            </h2>
            <div className="flex items-center space-x-2">
              <Favorite liveEvent={liveEvent} getLiveEvent={getLiveEvent} />
              <Love liveEvent={liveEvent} getLiveEvent={getLiveEvent} />
              {canAccess && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="ml-auto h-11 w-10 border-[#fff] bg-slate-100 p-0 hover:shadow-sm dark:border-[#1e172a] dark:bg-[#0c0319]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="right">
                    <Link href={`/admin/live-event/${params?.liveEventId}`}>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        {currentLanguage.course_card_edit}
                      </DropdownMenuItem>
                    </Link>
                    <ConfirmModal onConfirm={onDelete}>
                      <Button
                        size="sm"
                        variant="ghost"
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
          <Separator />
          <div className="p-4">
            <EventPreview
              value={liveEvent?.description!}
              startDateTime={liveEvent?.startDateTime!}
              endDateTime={liveEvent?.endDateTime!}
              isAdmin={false}
              themeColor={container.container?.ThemeColor!}
              darkThemeColor={container.container?.DarkThemeColor!}
            />
          </div>
        </div>
      </div>
      {liveEvent?.isStreamChat && (
        <div className="w-full md:w-1/2 lg:w-1/3">
          <Chat />
        </div>
      )}
    </div>
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      {theme === "dark" ? (
        <ClubyteLoader className="h-64 w-64" theme="dark" color="110524" />
      ) : (
        <ClubyteLoader className="h-64 w-64" theme="light" color="ffffff" />
      )}
    </div>
  );
};

export default LiveEventIdPage;