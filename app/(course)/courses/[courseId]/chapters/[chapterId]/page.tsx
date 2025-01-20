import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import { getProgress } from "@/actions/get-progress";
import { CourseSidebar } from "../../_components/course-sidebar";
import { db } from "@/lib/db";
import { languageServer } from "@/lib/check-language-server";
import CourseWrapper from "./_components/courseWrapper";
import authOptions from "@/lib/auth"; // Ensure you have this configured
import { currentProfile } from "@/lib/current-profile";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect("/");
  }

  const userId = session.user.id;
  const profile = await currentProfile();
  const currentLanguage: any = await languageServer();

  const { chapter, course } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const container = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  })

  const _course = await db.course.findUnique({
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

  if (!_course) {
    return redirect("/");
  }

  const authorImage = await db.profile.findUnique({
    where: {
      id: chapter?.authorId!,
    },
    select: {
      imageUrl: true,
    }
  });

  const progressCount = await getProgress(userId, _course.id);

  return (
    <div className="flex justify-between">
      <CourseWrapper params={params} currentLanguage={currentLanguage} currentProfileId={profile?.id!} profileImage={profile?.imageUrl!} authorImage={authorImage?.imageUrl!} purchaseLabel={currentLanguage.chapter_purchaseBanner_text} ThemeColor={container?.ThemeColor ?? ""} DarkThemeColor={container?.DarkThemeColor ?? ""}/>
      <div className="sm:min-h-[400px] sm:max-h-[500px] sm:min-w-[200px] sm:max-w-[300px] md:min-h-[450px] md:max-h-[505px] lg:min-h-[500px] lg:max-h-[520px] lg:min-w-[350px] lg:max-w-[400px] xl:min-h-[500px] xl:max-h-[600px] 2xl:min-[550px] 2xl:max-[650px]">
        <CourseSidebar course={_course} progressCount={progressCount} ThemeColor={container?.ThemeColor ?? ""} DarkThemeColor={container?.DarkThemeColor ?? ""}/>
      </div>
    </div>
  );
};

export default ChapterIdPage;