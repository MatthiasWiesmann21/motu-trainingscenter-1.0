"use client";

import { useLanguage } from "@/lib/check-language";
import { useIsAdmin, useIsClientAdmin } from "@/lib/roleCheck";
import { Infinity, Info, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Progress } from "./ui/progress";
import { max } from "moment";

type ContainerwithamountofCoursesProps = {
  courses: number;
  maxCourses: number;
  isFrontend?: boolean;
};

export const CourseCounter = ({
  maxCourses,
  courses,
  isFrontend,
}: ContainerwithamountofCoursesProps) => {
  const currentLanguage = useLanguage();
  const isRoleAdmins = useIsAdmin();
  const isRoleClientAdmin = useIsClientAdmin();
  const canAccess = isRoleAdmins || isRoleClientAdmin;
  const { onOpen } = useModal();

  const progressPercentage = (courses / maxCourses) * 100;

  const maxCourseDisplay =
    maxCourses > 50 ? (
      <Infinity className="ml-1 inline h-5 w-5" />
    ) : (
      maxCourses
    );

  return (
    <TooltipProvider>
      {canAccess && (
        <div className="flex w-full flex-col rounded-lg border-2 p-3 text-sm font-medium text-slate-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <p className="text-md xs:text-xs">
                {currentLanguage.search_courseCounter_currentCourses}
              </p>
              <p className="w-16 xs:text-xs">
                {courses} / {maxCourseDisplay}
              </p>
            </div>
            {isFrontend && (
              <Button
                className="rounded-lg border-2 border-slate-300 p-3 text-md xs:text-xs text-start text-slate-500 hover:border-slate-100 dark:border-slate-800"
                variant="outline"
                onClick={() => onOpen("createCourse")}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                {currentLanguage.courses_createCourse_button_text}
              </Button>
            )}
          </div>
          {maxCourses <= 50 && (
          <div className="mt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Progress value={progressPercentage} className="w-full" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${courses} ${currentLanguage.course_counter_outOf} ${maxCourses} ${currentLanguage.course_counter_courses}`}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          )}
        </div>
      )}
    </TooltipProvider>
  );
};