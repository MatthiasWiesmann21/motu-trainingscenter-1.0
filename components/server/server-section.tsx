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
            className="items-center justify-center rounded-md bg-slate-200 p-1 transition-all duration-300 hover:bg-slate-300 dark:bg-zinc-700/75 dark:hover:bg-zinc-700"
          >
            <Plus className="h-3 w-3 text-slate-600 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white" />
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
            className="items-center justify-center rounded-md bg-slate-200 p-1 transition-all duration-300 hover:bg-slate-300 dark:bg-zinc-700/75 dark:hover:bg-zinc-700"
          >
            <Settings className="h-4 w-4 text-slate-600 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};