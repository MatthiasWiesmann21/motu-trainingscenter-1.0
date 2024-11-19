"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole, Profile } from "@prisma/client";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
  EllipsisVertical,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { useLanguage } from "@/lib/check-language";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ServerHeaderProps {
  servers: any[];
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
  profile: Profile;
}

export const ServerHeader = ({
  servers,
  server,
  role,
  profile,
}: ServerHeaderProps) => {
  const { push } = useRouter();
  const { onOpen } = useModal();
  const currentLanguage = useLanguage();
  const isAdmin = role === MemberRole.ADMIN || profile.role === "ADMIN";
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <TooltipProvider>
      <div className="flex w-full items-center justify-between px-2 py-2">
        {/* Server Dropdown */}
        <div className="mr-2 flex-grow">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
              <button className="text-md flex h-12 w-full items-center rounded-lg px-3 font-semibold transition duration-300 ease-in-out hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
                <Image
                  priority
                  src={server?.imageUrl}
                  alt="server?.imagUrl"
                  width={24}
                  height={24}
                />
                <Tooltip>
                  <TooltipTrigger>
                    <span className="mx-2 line-clamp-2 text-sm font-semibold dark:text-[#baa5c1]">
                      {server?.name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="whitespace-normal text-sm">
                      {server?.name}
                    </span>
                  </TooltipContent>
                </Tooltip>
                <div className="ml-auto">
                  <ChevronDown className="max-w-8 h-5 max-h-8 w-5" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 space-y-[2px] bg-[#f6f8fa] text-xs font-medium text-black dark:bg-[#101828] dark:text-neutral-400">
              {servers?.map((each: ServerWithMembersWithProfiles, index) => (
                <DropdownMenuItem
                  onClick={() => push(`/chat/servers/${each?.id}`)}
                  className="flex h-10 cursor-pointer items-center p-1"
                  key={index}
                >
                  <Image
                    priority
                    src={each?.imageUrl}
                    alt="each?.imageUrl"
                    objectFit="contain"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="line-clamp-2 text-start text-sm font-semibold dark:text-[#baa5c1]">
                        {each?.name}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="whitespace-normal text-sm">
                        {each?.name}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </DropdownMenuItem>
              ))}
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => onOpen("createServer")}
                  className="flex h-10 cursor-pointer items-center p-1"
                >
                  <div className="flex h-8 cursor-pointer items-center">
                    <PlusCircle className="h-6 w-6 text-green-500" />
                    <p className="ml-2 text-sm font-semibold">
                      {currentLanguage.chat_server_addServer}
                    </p>
                  </div>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* EllipsisVertical Dropdown */}
        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
              <button className="text-md flex items-center justify-center rounded-full p-2 font-semibold transition duration-300 ease-in-out hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
                <EllipsisVertical className="text-[gray] dark:text-[white]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 space-y-1 text-xs font-medium text-black dark:text-neutral-400">
              {isModerator && (
                <DropdownMenuItem
                  onClick={() => onOpen("invite", { server })}
                  className="cursor-pointer px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400"
                >
                  {currentLanguage.chat_server_invite}
                  <UserPlus className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              )}
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => onOpen("editServer", { server })}
                  className="cursor-pointer px-3 py-2 text-sm"
                >
                  {currentLanguage.chat_server_edit}
                  <Settings className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              )}
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => onOpen("members", { server })}
                  className="cursor-pointer px-3 py-2 text-sm"
                >
                  {currentLanguage.chat_server_manage_members}
                  <Users className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              )}
              {isModerator && (
                <DropdownMenuItem
                  onClick={() => onOpen("createChannel")}
                  className="cursor-pointer px-3 py-2 text-sm"
                >
                  {currentLanguage.chat_server_create_channel}
                  <PlusCircle className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              )}
              {isModerator && <DropdownMenuSeparator />}
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => onOpen("deleteServer", { server })}
                  className="cursor-pointer px-3 py-2 text-sm text-rose-500"
                >
                  {currentLanguage.chat_server_delete}
                  <Trash className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              )}
              {!isAdmin && (
                <DropdownMenuItem
                  onClick={() => onOpen("leaveServer", { server })}
                  className="cursor-pointer px-3 py-2 text-sm text-rose-500"
                >
                  {currentLanguage.chat_server_leave}
                  <LogOut className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
};
