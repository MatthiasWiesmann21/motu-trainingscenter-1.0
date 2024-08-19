"use client";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
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

const LiveEventIdPage = ({ params }: { params: { liveEventId: string } }) => {
  const { userId } = useAuth();
  const [liveEvent, setLiveEvent] = useState<any>();
  const [category, setCategory] = useState<any>();

  const getLiveEvent = async () => {
    const response = await axios?.get(`/api/liveEvent/${params?.liveEventId}`, {
      params: { liveEventId: params?.liveEventId },
    });
    setLiveEvent(response?.data?.liveEvent);
    setCategory(response?.data?.category);
  };

  useEffect(() => {
    getLiveEvent();
  }, []);

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="flex items-center">
      <div className="flex w-[60%] flex-col pb-20">
        <div className="flex flex-col items-end justify-between p-4 pt-6 md:flex-row">
          <CategoryItem
            label={category?.name ?? ""}
            colorCode={category?.colorCode ?? ""}
          />
          <div className="flex flex-col items-end px-1">
            <p className="text-xs">{`Starts: ${moment(
              liveEvent?.startDateTime
            )?.format("DD-MM-YY HH:mm")}`}</p>
            <p className="text-xs">{`Ends: ${moment(
              liveEvent?.endDateTime
            )?.format("DD-MM-YY HH:mm")}`}</p>
          </div>
        </div>
        <div className="p-4">
          <VideoPlayer
            // @ts-ignore remove this
            liveEventId={params?.liveEventId}
            videoUrl={liveEvent?.videoUrl} // Hier fügen wir die Vimeo-URL aus den chapter Daten hinzu.
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
          <div className="flex flex-col items-center justify-between p-4 md:flex-row">
            <h2 className="mb-2 text-xl font-medium">{liveEvent?.title}</h2>
            <div className="flex items-center space-x-2">
              <Love liveEvent={liveEvent} getLiveEvent={getLiveEvent} />
            </div>
          </div>
          <Separator />
          <div className="p-4">
            <EventPreview value={liveEvent?.description!} />
          </div>
        </div>
      </div>
      <Chat />
    </div>
  );
};

export default LiveEventIdPage;
