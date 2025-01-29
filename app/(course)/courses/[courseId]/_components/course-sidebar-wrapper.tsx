import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth";
import { languageServer } from "@/lib/check-language-server";
import { isAdmin, isClientAdmin } from "@/lib/roleCheckServer";
import { CourseSidebar } from "./course-sidebar";

interface CourseSidebarWrapperProps {
  course: any;
  progressCount: number;
  ThemeColor: string;
  DarkThemeColor: string;
}

export const CourseSidebarWrapper = async ({
  course,
  progressCount,
  ThemeColor,
  DarkThemeColor,
}: CourseSidebarWrapperProps) => {
  const session = await getServerSession(authOptions);
  const currentLanguage = await languageServer();
  const isRoleAdmin = await isAdmin();
  const isRoleClientAdmin = await isClientAdmin();

  const canAccess = isRoleAdmin || isRoleClientAdmin;

  if (!session?.user?.id) {
    return redirect("/");
  }

  const userId = session.user.id;

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <CourseSidebar
      course={course}
      progressCount={progressCount}
      ThemeColor={ThemeColor}
      DarkThemeColor={DarkThemeColor}
      purchase={purchase}
      currentLanguage={currentLanguage}
      canAccess={canAccess}
    />
  );
};
