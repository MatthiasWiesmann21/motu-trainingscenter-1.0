import { Chapter, Course, UserProgress } from "@prisma/client";

import { NavbarRoutes } from "@/components/navbar-routes";

import { CourseMobileSidebar } from "./course-mobile-sidebar";
import { currentProfile } from "@/lib/current-profile";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseNavbar = async ({ course, progressCount }: CourseNavbarProps) => {
  const profile = await currentProfile();
  const profileId = profile?.id || "";
  const profileName = profile?.name || "";
  const profileImageUrl = profile?.imageUrl || "";
  const profileOnlineStatus = profile?.isOnline || "";

  return (
    <div className="flex h-full items-center border-b bg-[#ffffff] p-4 shadow-sm dark:bg-[#0A0118]">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes profileId={profileId} profileName={profileName} profileImageUrl={profileImageUrl} profileOnlineStatus={profileOnlineStatus}/>
    </div>
  );
};
