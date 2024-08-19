import { auth } from "@clerk/nextjs";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { db } from "@/lib/db";
import { CourseProgress } from "@/components/course-progress";

import { CourseSidebarItem } from "./course-sidebar-item";
import { Line } from "rc-progress";
import Progress from "./progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db?.purchase?.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course?.id,
      },
    },
  });

  const progress =
    course?.chapters?.reduce(
      (acc: any, val: any) => acc + (val?.userProgress[0]?.progress || 0),
      0
    ) / course?.chapters?.length;

  return (
    <TooltipProvider>
      <div className="m-3 flex h-full flex-col overflow-y-auto rounded-xl border-r bg-slate-100/60 shadow-sm dark:bg-[#0c0319]">
        <div className="flex flex-col border-b p-6">
          <Tooltip>
            <TooltipTrigger>
              <h1 className="mb-2 line-clamp-2 whitespace-normal break-words text-start font-semibold">
                {course?.title}
              </h1>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <h1 className="h-full max-w-[300px] whitespace-normal font-semibold">
                {course?.title}
              </h1>
            </TooltipContent>
          </Tooltip>
          {purchase && (
            <div className="mt-4">
              <Progress progress={progress} />
            </div>
          )}
        </div>
        <ScrollArea>
          <div className="flex w-full flex-col">
            {course?.chapters?.map((chapter) => (
              <CourseSidebarItem
                key={chapter?.id}
                id={chapter?.id}
                label={chapter?.title}
                isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                courseId={course.id}
                isLocked={!chapter.isFree && !purchase}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
};
