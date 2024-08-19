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
  children: React.ReactNode;
  onConfirm: () => void;
};

export const ConfirmModal = ({
  children,
  onConfirm
}: ConfirmModalProps) => {
  const currentLanguage = useLanguage();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{currentLanguage.confirmModal_DialogHeader}</AlertDialogTitle>
          <AlertDialogDescription>
            {currentLanguage.confirmModal_DialogDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{currentLanguage.confirmModal_DialogCancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {currentLanguage.confirmModal_DialogConfirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
