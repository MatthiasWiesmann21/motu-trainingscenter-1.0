"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useIsAdmin, useIsClientAdmin } from "@/lib/roleCheck";
import { useLanguage } from "@/lib/check-language";

interface ActionsProps {
  disabled: boolean;
  categoryId: string;
  isPublished: boolean;
};

export const Actions = ({
  disabled,
  categoryId,
  isPublished
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const currentLanguage = useLanguage();
  const isAdmin = useIsAdmin();
  const isClientAdmin = useIsClientAdmin();

  const canAccess = isAdmin || isClientAdmin;

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/category/${categoryId}/unpublish`);
        toast.success("Category unpublished");
      } else {
        await axios.patch(`/api/category/${categoryId}/publish`);
        toast.success("Category published");
        confetti.onOpen();
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }
  
  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/category/${categoryId}`);

      toast.success("Category deleted");
      router.push(`/admin/categories`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? `${currentLanguage.actions_unpublish}` : `${currentLanguage.actions_publish}`}
      </Button>
      {canAccess && (
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
      )}
    </div>
  )
}