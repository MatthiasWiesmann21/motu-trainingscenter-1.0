"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useSession } from "next-auth/react"; // Import useSession from NextAuth
import ClubyteLoader from "./ui/clubyte-loader";
import { useTheme } from "next-themes";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { data: session, status } = useSession(); // Use session from NextAuth
  const [token, setToken] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    if (status === "loading" || !session?.user?.name) return;

    const name = session.user.name;

    (async () => {
      try {
        const resp = await fetch(
          `/api/chat/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [session, chatId, status]);

  if (token === "") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        {theme === "dark" ? (
          <ClubyteLoader className="w-64 h-64" theme="dark" color="101828" />
        ) : (
          <ClubyteLoader className="w-64 h-64" theme="light" color="f6f8fa" />
        )}
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
