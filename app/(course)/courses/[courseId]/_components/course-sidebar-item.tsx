"use client";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
  const isActive =
    pathname?.split("/")[pathname?.split("/")?.length - 1] === id;

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            type="button"
            className={cn(
              "flex items-center gap-x-2 pl-2 text-sm font-[500] transition-all hover:bg-slate-300/20",
              isActive && " bg-slate-200/20 hover:bg-slate-200/20 ",
              isCompleted && "text-emerald-700 hover:text-emerald-700",
              isCompleted && isActive && "bg-emerald-200/20"
            )}
          >
            <div className="flex items-center py-4">
              <div className="pr-1">
                <Icon
                  size={18}
                  className={cn(
                    "w-12 text-black transition-all dark:text-white",
                    isActive && "w-12 text-slate-500",
                    isCompleted && "text-emerald-60 w-12"
                  )}
                />
              </div>
              <span className="line-clamp-2 text-start">{label}</span>
            </div>
            <div
              className={cn(
                "ml-auto h-full border-2 border-slate-700 opacity-0 transition-all",
                isActive && "opacity-100",
                isCompleted && "border-emerald-700"
              )}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-2">
          <p className="whitespace-normal font-semibold">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
