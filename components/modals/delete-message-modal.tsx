"use client";

import qs from "query-string";
import axios from "axios";
import { useState } from "react";

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

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const currentLanguage = useLanguage();
  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.delete(url);
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={onClose}>
      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader className="pt-8 px-6">
          <AlertDialogTitle className="text-2xl text-center font-bold">
            {currentLanguage.chat_modal_deleteMessage_title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-zinc-500">
            {currentLanguage.chat_modal_deleteMessage_description1} <br />
            {currentLanguage.chat_modal_deleteMessage_description2}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="px-6 py-4">
          <AlertDialogCancel disabled={isLoading}>
            {currentLanguage.chat_modal_deleteMessage_cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            disabled={isLoading}
            onClick={onClick}
          >
            {currentLanguage.chat_modal_deleteMessage_confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
