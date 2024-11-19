import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

import { CourseNavbar } from "./_components/course-navbar";
import { Sidebar } from "@/app/(dashboard)/_components/sidebar";
import authOptions  from "@/lib/auth"; // Ensure this is properly configured

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect("/");
  }

  const userId = session.user.id;

  const container = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  })

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      containerId: session?.user?.profile?.containerId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const progressCount = await getProgress(userId, course.id);

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-[80px] w-full md:pl-60">
        <CourseNavbar course={course} progressCount={progressCount} ThemeColor={container?.ThemeColor!} DarkThemeColor={container?.DarkThemeColor!} />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-60 flex-col md:flex">
        <Sidebar />
      </div>
      <div className="h-full w-full pt-[80px] md:pl-60">{children}</div>
    </div>
  );
};

export default CourseLayout;
