import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/check-language";
import { UserAvatar } from "./user-avatar";
import { signOut } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useDispatch } from "react-redux";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { CreditCardIcon, LogOutIcon, UserCog2Icon } from "lucide-react";

interface ProfileButtonProps {
  profileId: string;
  profileName: string;
  profileImageUrl: string;
  profileOnlineStatus: string;
  profileRole: string;
}

const statusColors: { [key: string]: string } = {
  Online: "bg-green-500",
  "Not Available": "bg-yellow-400",
  "Do Not Disturb": "bg-red-600",
  Invisible: "bg-slate-400",
  Offline: "bg-slate-400",
};

let socket: any;

const ProfileButton = ({
  profileId,
  profileName,
  profileImageUrl,
  profileOnlineStatus,
  profileRole,
}: ProfileButtonProps) => {
  const currentLanguage = useLanguage();
  const router = useRouter();
  const [status, setStatus] = useState(profileOnlineStatus);

  const socketInitializer = async () => {
    if (!socket) {
      await fetch("/api/socket"); // Ensure the socket API route is ready
      socket = io({ path: "/api/socket", transports: ["websocket"] });

      socket.on("connect", () => {
        socket.emit("join", { profileId });
      });

      // Adding this check to ensure `socket.on` is attached only when socket is ready
      socket.on("userCount", (count: number) => {
        fetchUserDetails(); // Update the user count in real-time
      });
    }
  };

  const fetchUserDetails = async () => {
    const reponse: any = await fetch("/api/profile");
    const data = await reponse.json();
    setStatus(data?.isOnline);
  };

  useEffect(() => {
    fetchUserDetails();
    socketInitializer();
    return () => {
      if (socket) {
        socket.off("userCount"); // Clean up event listener on component unmount
      }
    };
  }, [profileId, profileOnlineStatus]);

  const updateProfileStatus = async (isOnline: string) => {
    try {
      await axios.patch(`/api/profile/${profileId}`, { isOnline });
      fetchUserDetails();
      if (socket) {
        socket.emit("statusUpdate", { profileId, newStatus: isOnline });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSignOut = async () => {
    dispatch({ type: "SetUser", payload: {} });
    await updateProfileStatus("Offline");
    await signOut({ callbackUrl: "/auth/sign-in" });
  };

  const dispatch = useDispatch();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-6 w-6 rounded-xl border-0 bg-transparent"
          variant="ghost"
        >
          <div className="flex items-center justify-center rounded-full p-1 transition duration-200 ease-in-out hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]">
            <UserAvatar src={profileImageUrl} className="h-10 w-10" />
          </div>
          <div
            className={cn(
              "absolute bottom-4 right-4 z-10 h-4 w-4 rounded-full border-4 border-white dark:border-[#0a0118] md:h-4 md:w-4",
              statusColors[status]
            )}
          ></div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-1">
        <DropdownMenuItem>
          <div className="cursor-pointer transition hover:drop-shadow-md">
            <UserAvatar src={profileImageUrl} />
          </div>

          <div className="line-clamp-1 max-w-xs cursor-pointer pl-2 text-sm font-semibold">
            {profileName}
          </div>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="flex items-center">
              <div
                className={`ml-1 mr-3 h-4 w-4 rounded-lg ${
                  statusColors[status] || "bg-gray-400"
                }`}
              />
              <span>{currentLanguage.profile_status_text}</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => updateProfileStatus("Online")}>
                <div className="mr-2 h-4 w-4 rounded-lg border border-green-500 bg-green-500" />
                <span>{currentLanguage.profile_OnlineStatus_Online}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateProfileStatus("Not Available")}
              >
                <div className="mr-2 h-4 w-4 rounded-lg border border-yellow-400 bg-yellow-400" />
                <span>{currentLanguage.profile_OnlineStatus_Away}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateProfileStatus("Do Not Disturb")}
              >
                <div className="mr-2 h-4 w-4 rounded-lg border border-red-600 bg-red-600" />
                <span>{currentLanguage.profile_OnlineStatus_DoNotDisturb}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateProfileStatus("Invisible")}
              >
                <div className="mr-2 h-4 w-4 rounded-lg bg-slate-400" />
                <span>{currentLanguage.profile_OnlineStatus_Invisible}</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        {profileRole === "CLIENT ADMIN" && (
          <DropdownMenuItem onClick={() => router.push("/billing")}>
            <CreditCardIcon className="mr-2 h-6 w-6" />
            {currentLanguage.profile_manageBilling}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <UserCog2Icon className="mr-2 h-6 w-6" />
          {currentLanguage.profile_manageAccount}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon className="mr-2 h-6 w-6" />
          {currentLanguage.profile_signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
