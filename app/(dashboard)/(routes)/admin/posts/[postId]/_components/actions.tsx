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
  postId: string;
  isPublished: boolean;
};

export const Actions = ({
  disabled,
  postId,
  isPublished
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const currentLanguage = useLanguage();
  const isClientAdmin = useIsClientAdmin();
  const isAdmin = useIsAdmin();

  const canAccess = isAdmin || isClientAdmin;

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/posts/${postId}/unpublish`);
        toast.success("Post unpublished");
      } else {
        await axios.patch(`/api/posts/${postId}/publish`);
        toast.success("Post published");
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

      await axios.delete(`/api/posts/${postId}`);

      toast.success("Post deleted");
      router.push(`/admin/posts`);
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
        {isPublished ? `${currentLanguage.posts_actions_unpublish}` : `${currentLanguage.posts_actions_publish}`}
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