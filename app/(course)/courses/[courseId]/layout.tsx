import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

import { CourseNavbar } from "./_components/course-navbar";
import { Sidebar } from "@/app/(dashboard)/_components/sidebar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db?.course?.findUnique({
    where: {
      id: params?.courseId,
      containerId: process?.env?.CONTAINER_ID,
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
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-60 flex-col md:flex">
        <Sidebar />
      </div>
      <div className="h-full w-full pt-[80px] md:pl-60">{children}</div>
    </div>
  );
};

export default CourseLayout;
