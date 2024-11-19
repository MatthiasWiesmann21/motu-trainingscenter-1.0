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
import { BookOpen, Calendar, Clock, Clock8, GraduationCap } from "lucide-react";
import { formatDuration } from "@/lib/formatDuration";
import { Separator } from "../ui/separator";
import moment from "moment";
import { Button } from "../ui/button";
import { atcb_action } from "add-to-calendar-button-react";

interface EventInfoModalProps {
  children: React.ReactNode;
  description: string;
  title?: string;
  startDateTime: string;
  endDateTime: string;
}

export const EventInfoModal = ({
  description,
  children,
  title,
  startDateTime,
  endDateTime,
}: EventInfoModalProps) => {
  const currentLanguage = useLanguage();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <p className="text-2xl line-clamp-2">{title}</p>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Separator className="my-2" />
            <div className="my-2 grid grid-cols-2 items-start px-1">
              <div className="flex flex-row items-center gap-x-1">
                <Clock className="h-6 w-6 text-slate-500 dark:text-slate-600" />
                <p className="text-sm font-medium">{`Starts: ${moment(
                  startDateTime
                )?.format("DD-MM-YY HH:mm")}`}</p>
              </div>
              <div className="flex flex-row items-center gap-x-1">
                <Clock8 className="h-6 w-6 text-slate-500 dark:text-slate-600" />
                <p className="text-sm font-medium">{`Ends: ${moment(
                  endDateTime
                )?.format("DD-MM-YY HH:mm")}`}</p>
              </div>
            </div>

            <Separator className="my-2" />
            <DescriptionPreview value={description} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {currentLanguage.descriptionModal_DialogCancel}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
