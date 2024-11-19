import { Menu } from "lucide-react";
import { Chapter, Course, UserProgress } from "@prisma/client";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

import { CourseSidebarMobile } from "./course-sidebar-mobile";

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  ThemeColor: string;
  DarkThemeColor: string;
};

export const CourseMobileSidebar = ({ 
  course,
  progressCount,
  ThemeColor,
  DarkThemeColor,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-slate-100 dark:bg-[#0c0319]">
        <CourseSidebarMobile
          course={course}
          progressCount={progressCount}
          ThemeColor={ThemeColor}
          DarkThemeColor={DarkThemeColor}
        />
      </SheetContent>
    </Sheet>
  )
}