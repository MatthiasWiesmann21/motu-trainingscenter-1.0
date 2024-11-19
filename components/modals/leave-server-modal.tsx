"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/check-language";

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const currentLanguage = useLanguage();
  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const handleLeaveServer = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/chat/servers/${server?.id}/leave`);
      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={onClose}>
      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader className="pt-8 px-6">
          <AlertDialogTitle className="text-2xl text-center font-bold">
            {currentLanguage.chat_modal_leaveServer_title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {currentLanguage.chat_modal_leaveServer_description_1}
            <span className="font-semibold">
              {server?.name}
            </span>
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={onClose}
              variant="ghost"
            >
              {currentLanguage.chat_modal_leaveServer_cancel}
            </Button>
            <AlertDialogAction
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600"
              onClick={handleLeaveServer}
            >
              {currentLanguage.chat_modal_leaveServer_leave}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
