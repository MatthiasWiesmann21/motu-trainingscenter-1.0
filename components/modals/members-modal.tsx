"use client";

import axios from "axios";
import qs from "query-string";
import { 
  Check,
  Gavel,
  Loader2,
  MoreVertical, 
  Shield, 
  ShieldAlert, 
  ShieldCheck,
  ShieldQuestion
} from "lucide-react";
import { useState } from "react";
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/check-language";
import ClubyteLoader from "../ui/clubyte-loader";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500" />
}

export const MembersModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");
  const { theme } = useTheme();
  const currentLanguage = useLanguage();
  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/chat/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);

      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/chat/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      });

      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={onClose}>
      <AlertDialogContent className="overflow-hidden">
        <AlertDialogHeader className="pt-8 px-6">
          <AlertDialogTitle className="text-2xl text-center font-bold">
            {currentLanguage.chat_modal_manageMembers_title}
          </AlertDialogTitle>
          <AlertDialogDescription 
            className="text-center"
          >
            {server?.members?.length} {currentLanguage.chat_modal_manageMembers_description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile?.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile?.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs">
                  {member.profile?.email}
                </p>
              </div>
              {server.profileId !== member.profileId && loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="w-4 h-4 mr-2" />
                          <span>{currentLanguage.chat_modal_manageMembers_role_label}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                              <Shield className="h-4 w-4 mr-2" />
                              {currentLanguage.chat_modal_manageMembers_role_guest}
                              {member.role === "GUEST" && <Check className="h-4 w-4 ml-auto" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              {currentLanguage.chat_modal_manageMembers_role_moderator}
                              {member.role === "MODERATOR" && <Check className="h-4 w-4 ml-auto" />}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member.id)}>
                        <Gavel className="h-4 w-4 mr-2" />
                        {currentLanguage.chat_modal_manageMembers_kick}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && <Loader2 className="h-4 w-4 ml-auto animate-spin" />}
            </div>
          ))}
        </ScrollArea>
        <AlertDialogFooter>
          <div className="flex items-center justify-end w-full">
            <Button
              onClick={onClose}
              variant="ghost"
            >
              {currentLanguage.descriptionModal_DialogCancel}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
