"use client";

import {
  CheckCircle,
  Lock,
  MoreVertical,
  Pencil,
  PlayCircle,
  Trash,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import axios from "axios";
import toast from "react-hot-toast";
import { useLanguage } from "@/lib/check-language";
import { useIsAdmin, useIsClientAdmin } from "@/lib/roleCheck";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
  collapsed?: boolean;
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
  collapsed,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const currentLanguage = useLanguage();
  const isAdmin = useIsAdmin();
  const isClientAdmin = useIsClientAdmin();

  const canAccess = isAdmin || isClientAdmin;

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
  const isActive =
    pathname?.split("/")[pathname?.split("/")?.length - 1] === id;

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  const redirectToChapter = () => {
    router.push(`/admin/courses/${courseId}/chapters/${id}`);
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/courses/${courseId}/chapters/${id}`);
      toast.success("Chapter deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <TooltipProvider>
      <div className="relative flex w-full items-center border-b-2">
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Main button to open chapter */}
            <button
              onClick={onClick}
              type="button"
              className={cn(
                "flex w-full items-center gap-x-2 pl-2 text-sm font-[500] transition-all hover:bg-slate-300/20",
                isActive && "bg-slate-200/20 hover:bg-slate-200/20",
                isCompleted && "text-emerald-700 hover:text-emerald-700",
                isCompleted && isActive && "bg-emerald-200/20",
                collapsed && "justify-center px-2"
              )}
            >
              <div
                className={cn(
                  "flex items-center py-4 w-full",
                  collapsed ? "justify-center" : "justify-start"
                )}
              >
                <div className="flex items-center">
                  <Icon
                    size={18}
                    className={cn(
                      "text-black transition-all dark:text-white",
                      isActive && "text-slate-500",
                      isCompleted && "text-emerald-60",
                      collapsed ? "w-6" : "w-8"
                    )}
                  />
                </div>
                {!collapsed && (
                  <p className="line-clamp-1 text-left pl-2">{label}</p>
                )}
              </div>
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">
              <p className="font-semibold">{label}</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* Dropdown Menu Trigger - Separate from Tooltip */}
        {canAccess && !collapsed && (
          <div className="absolute right-2 top-[50%] -translate-y-[50%]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-slate-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={redirectToChapter}>
                  <Pencil className="h-4 w-4 mr-2" />
                  {currentLanguage.courses_sidebar_editChapter}
                </DropdownMenuItem>
                <ConfirmModal
                  onConfirm={onDelete}
                  title={currentLanguage.courses_sidebar_deleteChapter}
                  description={currentLanguage.courses_sidebar_deleteChapterDescription}
                >
                  <DropdownMenuItem>
                    <Trash className="h-4 w-4 mr-2" />
                    {currentLanguage.courses_sidebar_deleteChapter}
                  </DropdownMenuItem>
                </ConfirmModal>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};