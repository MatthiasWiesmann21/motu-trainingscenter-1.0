"use client";

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

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const currentLanguage = useLanguage();
  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/chat/servers/${server?.id}`);

      onClose();
      router.refresh();
      router.push("/");
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
            {currentLanguage.chat_modal_delete_server_title}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {currentLanguage.chat_modal_delete_server_description_1} <br />
            <span className="text-indigo-500 font-semibold">{server?.name}</span> {currentLanguage.chat_modal_delete_server_description_2}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={onClose}
              variant="ghost"
            >
              {currentLanguage.chat_modal_delete_server_cancel_button}
            </Button>
            <Button
              disabled={isLoading}
              variant="primary"
              onClick={onClick}
            >
              {currentLanguage.chat_modal_delete_server_delete_button}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}