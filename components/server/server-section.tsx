"use client";

import { ChannelType, MemberRole } from "@prisma/client";
// @ts-ignore
import { Plus, Settings } from "lucide-react";

import { ServerWithMembersWithProfiles } from "@/types";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { useLanguage } from "@/lib/check-language";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  const currentLanguage = useLanguage();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip
          label={currentLanguage.chat_server_create_channel}
          side="top"
        >
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="items-center justify-center rounded-full bg-[#e7e7e9] p-1 transition-all duration-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-500"
          >
            <Plus className="h-3 w-3 text-zinc-400 hover:text-white dark:text-zinc-300 dark:hover:text-zinc-300" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip
          label={currentLanguage.chat_server_manage_members}
          side="top"
        >
          <button
            onClick={() => onOpen("members", { server })}
            className="items-center justify-center rounded-full bg-[#e7e7e9] p-1 transition-all duration-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-500"
          >
            <Settings className="h-4 w-4 text-zinc-400 hover:text-white dark:text-zinc-300 dark:hover:text-zinc-300" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
