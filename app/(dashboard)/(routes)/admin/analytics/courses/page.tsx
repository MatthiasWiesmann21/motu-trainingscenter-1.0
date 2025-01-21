import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { getCourses } from "@/actions/get-courses";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { languageServer } from "@/lib/check-language-server";
import authOptions from "@/lib/auth";
import { db } from "@/lib/db";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";
import GoBackButton from "@/components/goBackButton";

const CourseAnalyticsPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  
  const currentLanguage = await languageServer();

  if (!userId) {
    return redirect("/search");
  }

  const isRoleAdmins = await isAdmin();
  const isRoleOperator = await isOperator();
  const isRoleClientAdmin = await isClientAdmin();
  const canAccess = isRoleAdmins || isRoleOperator || isRoleClientAdmin || isOwner(userId);

  if (!canAccess) {
    return redirect("/search");
  }

  const allCourses = await db.course.findMany({
    where: {
      isPublished: true,
      containerId: session?.user?.profile?.containerId,
    },
    include: {
      purchases: true,
      chapters: {
        include: {
          userProgress: true,
          likes: true
        }
      }
    },
  });

  const chapters = await db.chapter.findMany({
    where: {
      isPublished: true,
      course: {
        isPublished: true,
        containerId: session?.user?.profile?.containerId,
      }
    },
  })

  const coursesProgress = allCourses.map(course => {
    if (!course.purchases?.length) return null;
    
    const chapterProgresses = course.chapters.map(chapter => {
      const progress = chapter.userProgress?.[0]?.isCompleted ? 100 : (chapter.userProgress?.[0]?.progress || 0);
      return progress;
    });
    
    const isAllCompleted = chapterProgresses.every(progress => progress === 100);
    if (isAllCompleted) return 100;
    
    const totalProgress = chapterProgresses.reduce((acc, val) => acc + val, 0);
    return Math.round(totalProgress / course.chapters.length);
  }).filter(progress => progress !== null);

  const notStartedCourses = coursesProgress.filter((progress): progress is number => progress !== null && progress === 0).length;
  const inProgressCourses = coursesProgress.filter((progress): progress is number => progress !== null && progress > 0 && progress < 100).length;
  const completedCourses = coursesProgress.filter((progress): progress is number => progress !== null && progress === 100).length;

  const totalCourses = allCourses.length;
  const totalPurchases = allCourses.reduce((acc, course) => acc + course.purchases.length, 0);

  const purchaseData = allCourses.map(course => ({
    name: course.title || "Untitled",
    total: course.purchases.length,
  }));

  const likesData = allCourses.map(course => ({
    name: course.title || "Untitled",
    total: course.chapters.reduce((acc, chapter) => acc + chapter.likes.length, 0),
  }));

  return (
    <div className="p-6">
      <GoBackButton buttonText={currentLanguage.goBack_button_text} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <DataCard
          label={currentLanguage.analytic_courses_totalCourses_label}
          value={totalCourses}
        />
        <DataCard
          label={currentLanguage.analytic_courses_totalChapters_label}
          value={chapters.length}
        />
        <DataCard
          label={currentLanguage.analytic_courses_totalPurchasedCourses_label}
          value={totalPurchases}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <DataCard
          label={currentLanguage.analytic_courses_NotStartedCourses_label}
          value={notStartedCourses}
        />
        <DataCard
          label={currentLanguage.analytic_courses_inProgress_label}
          value={inProgressCourses}
        />
        <DataCard
          label={currentLanguage.analytic_courses_completedCourses_label}
          value={completedCourses}
        />
      </div>
      <Chart data={purchaseData} label={currentLanguage.analytic_courses_coursePurchasDistribution_label} />
      <Chart data={likesData} label={currentLanguage.analytic_courses_totalCourseLikes_label}/>
    </div>
  );
};

export default CourseAnalyticsPage;