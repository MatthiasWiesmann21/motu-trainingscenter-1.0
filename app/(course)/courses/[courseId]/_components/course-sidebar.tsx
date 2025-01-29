"use client";

import { Chapter, Course, UserProgress } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CourseProgress } from "@/components/course-progress";
import { CourseInfoModal } from "@/components/modals/course-info-modal";
import { Button } from "@/components/ui/button";
import { Edit, Info, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CourseSidebarItem } from "./course-sidebar-item";
import Progress from "./progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DescriptionModal } from "@/components/modals/description-modal";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  ThemeColor: string;
  DarkThemeColor: string;
  purchase: any;
  currentLanguage: any;
  canAccess: boolean;
}

export const CourseSidebar = ({
  course,
  progressCount,
  ThemeColor,
  DarkThemeColor,
  purchase,
  currentLanguage,
  canAccess,
}: CourseSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const progress =
    course.chapters.reduce(
      (
        acc: number,
        chapter: Chapter & { userProgress: UserProgress[] | null }
      ) => acc + (chapter.userProgress?.[0]?.progress || 0),
      0
    ) / course.chapters.length;

  return (
    <TooltipProvider>
      <div
        className={cn(
          "h-4/5 flex-shrink-0 transition-all duration-300 mr-2 hidden md:block",
          collapsed ? "w-[90px]" : "w-[250px]"
        )}
      >
        <div
          className={cn(
            "no-scrollbar m-2 mt-4 flex h-full flex-col overflow-y-auto rounded-xl border-2 bg-transparent shadow-sm dark:bg-[#0c0319] md:block",
            collapsed && "items-center"
          )}
        >
          <div
            className={cn(
              "flex flex-col border-b bg-slate-100 px-4 pt-4 dark:bg-[#0c0319]",
              collapsed && "items-center"
            )}
          >
            <div
              className={cn(
                "flex",
                collapsed ? "justify-center" : "justify-between"
              )}
            >
              {!collapsed && (
                <Tooltip>
                  <TooltipTrigger>
                    <h1 className="line-clamp-2 whitespace-normal break-words text-start font-semibold">
                      {course.title}
                    </h1>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <h1 className="h-full max-w-[300px] whitespace-normal font-semibold">
                      {course.title}
                    </h1>
                  </TooltipContent>
                </Tooltip>
              )}
              <div
                className={cn(
                  "flex items-center",
                  collapsed ? "flex-col space-y-2" : "ml-2"
                )}
              >
                <Tooltip>
                  <TooltipTrigger>
                    <CourseInfoModal
                      description={course.description!}
                      title={course.title!}
                      level={course.level!}
                      duration={course.duration!}
                      chapters={course.chapters.length}
                      ThemeColor={ThemeColor}
                      DarkThemeColor={DarkThemeColor}
                    >
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-slate-200"
                      >
                        <Info width={16} height={16} />
                      </Button>
                    </CourseInfoModal>
                    <TooltipContent side="bottom">
                      <p className="h-full max-w-[300px] whitespace-normal font-semibold">
                        {currentLanguage.courses_sidebar_infoDescription}
                      </p>
                    </TooltipContent>
                  </TooltipTrigger>
                </Tooltip>
                {canAccess && (
                  <Link href={`/admin/courses/${course.id}`}>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-slate-200"
                    >
                      <Edit width={16} height={16} />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            {purchase && !collapsed && (
              <div className="mt-4">
                <Progress
                  progress={progress}
                  ThemeColor={ThemeColor}
                  DarkThemeColor={DarkThemeColor}
                />
              </div>
            )}
            <div className="mt-2 border-t-2 p-2">
              <Button
                onClick={() => setCollapsed(!collapsed)}
                variant="ghost"
                className="flex w-full items-center justify-center hover:bg-slate-200"
              >
                <ChevronLeft
                  className={cn(
                    "h-5 w-5 transition-all",
                    !collapsed && "rotate-180"
                  )}
                />
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-col border-t-2">
            {course.chapters.map((chapter) => (
              <CourseSidebarItem
                key={chapter.id}
                id={chapter.id}
                label={chapter.title}
                isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                courseId={course.id}
                isLocked={!chapter.isFree && !purchase}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
