"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/lib/roleCheck";
import { useLanguage } from "@/lib/check-language";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface deleteProfileFormProps {
  profileId: string;
}

export const DeleteProfileForm = ({
  profileId,
}: deleteProfileFormProps) => {
  const isAdmin = useIsAdmin();
  const currentLanguage = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/profile/${profileId}`);

      toast.success("Profile deleted");
      router.push(`/auth/sign-in`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-6 flex rounded-md border justify-between border-red-600 bg-slate-200 p-4 dark:bg-slate-700">
      <div className="flex items-center font-semibold text-lg text-red-600">
        {currentLanguage.user_DeleteProfileForm_title}
      </div>
      <div className="my-4 flex">
      <ConfirmModal dialogActionClass="bg-red-600 mt-2" onConfirm={onDelete}>
        <Button size="sm" variant="destructive" disabled={isLoading}>
          <Trash className="h-5 w-5" />
        </Button>
      </ConfirmModal>
      </div>
    </div>
  );
};
