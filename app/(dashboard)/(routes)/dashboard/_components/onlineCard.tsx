"use client";
import { Users } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { useLanguage } from "@/lib/check-language";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useContainerData } from "@/hooks/useContainerData";
import { useRouter } from "next/navigation";

export const OnlineCard = ({
  profileId,
  user,
}: {
  profileId: string;
  user: any;
}) => {
  // const { container, loading } = useContainerData();
  const currentLanguage = useLanguage();
  const [userCount, setUserCount] = useState(0);
  const socket = useRef<Socket | null>(null);
  const { refresh } = useRouter();

  useEffect(() => {
    if (user?.profile?.containerId) return;
    setContainer();
  }, [user?.profile?.containerId, user?.profile?.id]);

  useEffect(() => {
    socketInitializer();

    return () => {
      socket.current?.off("userCount");
      socket.current?.disconnect(); // Clean up socket connection on component unmount
    };
  }, []);

  const setContainer = async () => {
    const response = await fetch("/api/auth/container", {
      method: "GET",
    });
    const container = await response?.json();
    if (!user?.profile?.containerId && !!user?.profile?.id) {
      const profile: any = await fetch(`/api/profile/${user?.profile?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ containerId: container?.id }),
      });
      const result = await profile.json();
      if (result?.id) window?.location?.reload();
    }
  };

  const socketInitializer = async () => {
    await fetch("/api/socket"); // Initialize server-side socket

    // Connect to the "userCount" namespace
    socket.current = io("/userCount", {
      path: "/api/socket",
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      socket.current?.emit("join", { profileId });
    });

    // Attach the event listener here after ensuring the socket is initialized
    socket.current.on("userCount", (count: number) => {
      setUserCount(count);
    });
  };

  return (
    <div className="flex items-center gap-x-2 rounded-md border-2 p-3 dark:border-[#221b2e] dark:bg-[#0D071A]">
      <IconBadge variant={"default"} icon={Users} />
      <div>
        <p className="text-sm text-gray-600">
          {currentLanguage?.infocard_currentOnlineUsers}
        </p>
        <p className="font-medium">
          {userCount < 10 ? `0${userCount}` : userCount}
        </p>
      </div>
    </div>
  );
};