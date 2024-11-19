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
import { EventPreview } from "../event-preview";
import { DescriptionPreview } from "../description-preview";

interface ConfirmModalProps {
  children: React.ReactNode;
  description: string;
  title?: string;
};

export const DescriptionModal = ({
  description,
  children,
  title,
}: ConfirmModalProps) => {
  const currentLanguage = useLanguage();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ? (
              <p className="text-xl">{title}</p>
            ) : (
              <p className="text-xl">{currentLanguage.descriptionModal_DialogHeader}</p>
            )}
            </AlertDialogTitle>
          <AlertDialogDescription>
          <DescriptionPreview
              value={description}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel>{currentLanguage.descriptionModal_DialogCancel}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
