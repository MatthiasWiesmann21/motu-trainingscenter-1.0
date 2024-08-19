import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/check-language";
import { HelpCircle, LogOutIcon, UserCog2Icon } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useDispatch } from "react-redux";
import axios from "axios";
import { cn } from "@/lib/utils";

interface ProfileButtonProps {
  profileId: string;
  profileName: string;
  profileImageUrl: string;
  profileOnlineStatus: string;
}

const statusColors: { [key: string]: string } = {
  Online: "bg-green-500",
  "Not Available": "bg-yellow-400",
  "Do Not Disturb": "bg-red-600",
  Invisible: "bg-slate-400",
  Offline: "bg-slate-400",
};

const ProfileButton = ({
  profileId,
  profileName,
  profileImageUrl,
  profileOnlineStatus,
}: ProfileButtonProps) => {
  const currentLanguage = useLanguage();
  const { signOut } = useClerk();
  const router = useRouter();
  const user = useClerk();
  const isSignedIn = useUser();

  const updateProfileStatus = async (isOnline: string) => {
    try {
      await axios.patch(`/api/profile/${profileId}`, { isOnline });
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSignOut = async () => {
    dispatch({ type: "SetUser", payload: {} });
    await updateProfileStatus("Offline");
    signOut(() => router.push("sign-in"));
  };

  useEffect(() => {
    if (isSignedIn && profileOnlineStatus === "Offline") {
      updateProfileStatus("Online");
    } else if (!isSignedIn) {
      updateProfileStatus("Offline");
    }
  }, [isSignedIn, profileOnlineStatus]);

  const dispatch = useDispatch();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-6 w-6 rounded-xl border-0 bg-transparent"
                variant="ghost"
              >
                <UserAvatar src={profileImageUrl} />
                <div
                  className={cn(
                    "absolute bottom-4 right-4 z-10 h-4 w-4 rounded-full border-4 border-white dark:border-[#0a0118] md:h-4 md:w-4",
                    statusColors[profileOnlineStatus]
                  )}
                ></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1">
              <DropdownMenuItem
                onClick={() => router.push("/profile/manageUsername")}
              >
                <div className="cursor-pointer transition hover:drop-shadow-md">
                  <UserAvatar src={profileImageUrl} />
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="line-clamp-1 max-w-xs cursor-pointer pl-2 text-sm font-semibold">
                      {profileName}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs whitespace-normal text-sm font-semibold">
                      {profileName}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <div className="flex items-center">
                    <div
                      className={`ml-1 mr-3 h-4 w-4 rounded-lg ${
                        statusColors[profileOnlineStatus] || "bg-gray-400"
                      }`}
                    />
                    <span>{currentLanguage.profile_status_text}</span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => updateProfileStatus("Online")}
                    >
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
                      <span>
                        {currentLanguage.profile_OnlineStatus_DoNotDisturb}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateProfileStatus("Invisible")}
                    >
                      <div className="mr-2 h-4 w-4 rounded-lg bg-slate-400" />
                      <span>
                        {currentLanguage.profile_OnlineStatus_Invisible}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem
                onClick={() =>
                  window.open("https://docs.clubyte.live", "_blank")
                }
              >
                <HelpCircle className="mr-2 h-6 w-6" />
                {currentLanguage.profile_help}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/profile/manageProfile")}
              >
                <UserCog2Icon className="mr-2 h-6 w-6" />
                {currentLanguage.profile_manageAccount}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOutIcon className="mr-2 h-6 w-6" />
                {currentLanguage.profile_signOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {currentLanguage.navigation_profile_tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProfileButton;
