"use client";

import axios from "axios";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useLanguage } from "@/lib/check-language";

export const InviteModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();
  const currentLanguage = useLanguage();
  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/chat/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/chat/servers/${server?.id}/invite-code`
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={onClose}>
      <AlertDialogContent className="overflow-hidden p-0">
        <AlertDialogHeader className="px-6 pt-8">
          <AlertDialogTitle className="text-center text-2xl font-bold">
            {currentLanguage.chat_modal_invite_title}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6">
          <Label className="text-xs font-bold uppercase">
            {currentLanguage.chat_modal_invite_link_label}
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              disabled={isLoading}
              className="ring-offset-0"
              value={inviteUrl}
              readOnly
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="mt-4 text-xs"
          >
            {currentLanguage.chat_modal_invite_new}
            <RefreshCw className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <AlertDialogFooter className="px-6 py-4">
          <AlertDialogCancel>
            {currentLanguage.descriptionModal_DialogCancel}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
