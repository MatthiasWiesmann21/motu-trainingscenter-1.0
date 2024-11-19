"use client";

import { Plus } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { Separator } from "../ui/separator";
import { useIsAdmin, useIsOperator } from "@/lib/roleCheck";
import { useLanguage } from "@/lib/check-language";

export const NavigationAction = () => {
  const { onOpen } = useModal();
  const isAdmin = useIsAdmin();
  const isOperator = useIsOperator();
  const currentLanguage = useLanguage();
  const canAccess = isAdmin || isOperator;

  return (
    canAccess && ( 
      <>
        <div>
          <ActionTooltip side="right" align="center" label={currentLanguage.chat_server_addServer}>
            <button
              onClick={() => onOpen("createServer")}
              className="group flex items-center"
            >
              <div className="mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-[#0b6495] dark:bg-neutral-700">
                <Plus
                  className="text-[#0b6495] transition group-hover:text-white"
                  size={25}
                />
              </div>
            </button>
          </ActionTooltip>
        </div>
        <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
      </>
    )
  );
};
