"use client";

import qs from "query-string";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/check-language";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const currentLanguage = useLanguage();
  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/chat/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        }
      })

      await axios.delete(url);

      onClose();
      router.refresh();
      router.push(`/chat/servers/${server?.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {currentLanguage.chat_modal_deleteChannel_title}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {currentLanguage.chat_modal_deleteChannel_description_1} <br />
            <span className="text-indigo-500 font-semibold">#{channel?.name}</span> {currentLanguage.chat_modal_deleteChannel_description_2}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={onClose}
              variant="ghost"
            >
              {currentLanguage.chat_modal_deleteChannel_cancel_button}
            </Button>
            <Button
              disabled={isLoading}
              variant="primary"
              onClick={onClick}
            >
              {currentLanguage.chat_modal_deleteChannel_delete_button}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}