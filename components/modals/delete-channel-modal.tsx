"use client";

import qs from "query-string";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useLanguage } from "@/lib/check-language";
import toast from "react-hot-toast";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const currentLanguage = useLanguage();
  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data || {};

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/chat/channels/${channel?.id}`,
        query: { serverId: server?.id },
      });

      await axios.delete(url);

      toast.success("Channel deleted");

      onClose();
      router.refresh();
      router.push(`/chat/servers/${server?.id}`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={onClose}>
      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader className="px-6 pt-8">
          <AlertDialogTitle className="text-2xl text-center font-bold">
            {currentLanguage.chat_modal_deleteChannel_title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center mt-4">
            {currentLanguage.chat_modal_deleteChannel_description_1}
            <br />
            <span className="font-semibold">#{channel?.name}</span> {currentLanguage.chat_modal_deleteChannel_description_2}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="px-6 py-4">
          <AlertDialogCancel disabled={isLoading}>
            {currentLanguage.chat_modal_deleteChannel_cancel_button}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            disabled={isLoading}
            onClick={handleDelete}
          >
            {currentLanguage.chat_modal_deleteChannel_delete_button}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
