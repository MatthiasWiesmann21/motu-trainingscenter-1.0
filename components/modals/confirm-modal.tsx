"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/lib/check-language";

interface ConfirmModalProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onConfirm: () => void;
  dialogTitleClass?: string;
  dialogDescriptionClass?: string;
  dialogCancelClass?: string;
  dialogActionClass?: string
};

export const ConfirmModal = ({
  title,
  description,
  children,
  onConfirm,
  dialogTitleClass,
  dialogDescriptionClass,
  dialogCancelClass,
  dialogActionClass,
}: ConfirmModalProps) => {
  const currentLanguage = useLanguage();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={dialogTitleClass}>{currentLanguage.confirmModal_DialogHeader}</AlertDialogTitle>
          <AlertDialogDescription className={dialogDescriptionClass}>
            {currentLanguage.confirmModal_DialogDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={dialogCancelClass}>{currentLanguage.confirmModal_DialogCancel}</AlertDialogCancel>
          <AlertDialogAction className={dialogActionClass} onClick={onConfirm}>
            {currentLanguage.confirmModal_DialogConfirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};