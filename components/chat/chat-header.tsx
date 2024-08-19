import { Hash } from "lucide-react";

import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";

import { ChatVideoButton } from "./chat-video-button";
import { MobileSidebarChat } from "@/app/(dashboard)/_components/mobile_sidebar_chat";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  serverId: string;
  name: string | null;
  type: "channel" | "conversation";
  imageUrl?: string;
  profileOnlineStatus: string;
}

const statusColors: { [key: string]: string } = {
  "Online": "bg-green-500",
  "Not Available": "bg-yellow-400",
  "Do Not Disturb": "bg-red-600",
  "Invisible": "bg-slate-400",
  "Offline": "bg-slate-400",
};

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
  profileOnlineStatus,
}: ChatHeaderProps) => {
  return (
    <div className="text-md sticky flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileSidebarChat serverId={serverId} />
      {type === "channel" && (
        <Hash className="mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === "conversation" && (
        <>
          <UserAvatar src={imageUrl} className="mr-2 h-8 w-8 md:h-8 md:w-8" />
          <div
            className={cn(
              "absolute bottom-1 left-2 z-10 h-4 w-4 rounded-full border-4 border-white dark:border-[#101828] md:h-4 md:w-4",
              statusColors[profileOnlineStatus]
            )}
          ></div>
        </>
      )}
      <p className="text-md font-semibold text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  );
};
