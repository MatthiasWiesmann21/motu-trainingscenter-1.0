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
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import { formatDuration } from "@/lib/formatDuration";
import { useTheme } from "next-themes";

interface CourseInfoModalProps {
  children: React.ReactNode;
  description: string;
  title?: string;
  duration?: string;
  level?: string;
  chapters?: number;
  ThemeColor: string;
  DarkThemeColor: string;
}

export const CourseInfoModal = ({
  description,
  children,
  title,
  duration,
  level,
  chapters,
  ThemeColor,
  DarkThemeColor,
}: CourseInfoModalProps) => {
  const currentLanguage = useLanguage();
  const { theme } = useTheme();

  const getThemeColor = () => {
    if (theme === "dark") {
      return DarkThemeColor;
    }
    return ThemeColor;
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ? (
              <p className="text-2xl">{title}</p>
            ) : (
              <p className="text-2xl">
                {currentLanguage.descriptionModal_DialogHeader}
              </p>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="mt-2 grid grid-cols-3 items-center text-sm font-bold">
              {chapters && (
                <div className="my-2 flex items-center">
                  <BookOpen
                    className="h-5 w-5" // fixed width and height (e.g., w-5 = 20px)
                    style={{ color: getThemeColor() }}
                  />
                  <span className="ml-1 text-sm">
                    {chapters}{" "}
                    {chapters < 2
                      ? currentLanguage.course_card_chapter
                      : currentLanguage.course_card_chapters}
                  </span>{" "}
                </div>
              )}
              {duration && (
                <div className="my-2 flex items-center">
                  <Clock
                    className="h-5 w-5" // ensure fixed width and height here as well
                    style={{ color: getThemeColor() }}
                  />
                  <span className="ml-1 text-sm">
                    {formatDuration(duration.toString())}
                  </span>
                </div>
              )}
              {level && (
                <div className="my-2 flex items-center">
                  <GraduationCap
                    className="h-5 w-5" // fixed size for GraduationCap
                    style={{ color: getThemeColor() }}
                  />
                  <span className="ml-1 text-sm">
                    {level || currentLanguage.course_card_no_level}
                  </span>
                </div>
              )}
            </div>
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
