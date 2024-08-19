import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import { getProgress } from "@/actions/get-progress";
import { CourseSidebar } from "../../_components/course-sidebar";
import { db } from "@/lib/db";
import { languageServer } from "@/lib/check-language-server";
import CourseWrapper from "./_components/courseWrapper";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  const currentLanguage: any = await languageServer();

  if (!userId) {
    return redirect("/");
  }

  const { chapter, course } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const _course = await db?.course?.findUnique({
    where: {
      id: params.courseId,
      containerId: process.env.CONTAINER_ID,
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

  if (!_course) {
    return redirect("/");
  }

  const progressCount = await getProgress(userId, _course?.id);

  return (
    <div className="flex justify-between">
      <CourseWrapper params={params} currentLanguage={currentLanguage} />
      <div className="max-h-[500px] min-h-[400px] md:min-w-[270px] md:max-w-[350px] lg:min-w-[350px] lg:max-w-[400px]">
        <CourseSidebar course={_course} progressCount={progressCount} />
      </div>
    </div>
  );
};

export default ChapterIdPage;
