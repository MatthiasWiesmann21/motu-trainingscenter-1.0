import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CheckCircle, Clock, ListChecks, Users } from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";

import { InfoCard } from "./_components/info-card";
import { getSearchCourses } from "@/actions/get-searchcourses";
import { db } from "@/lib/db";
import { languageServer } from "@/lib/check-language-server";
import PolygonChar from "./_components/polygonChar";
import CourseTable from "./_components/courseTable";
import { getCourses } from "@/actions/get-courses";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const Dashboard = async ({ searchParams }: SearchPageProps) => {
  const currentLanguage = await languageServer();
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  const courses = await getSearchCourses({
    userId,
    ...searchParams,
  });

  const purchasedCourses = courses.filter((course) => course.isPurchased);

  const container: any = await db.container.findUnique({
    where: {
      id: process.env.CONTAINER_ID,
    },
  });

  const UserProgressCompletedChapters = await db.userProgress.count({
    where: {
      userId,
      isCompleted: true,
    },
  });
  // console.log("UserProgressCompletedChapters", UserProgressCompletedChapters);

  const CurrentOnlineUser = await db.profile.count({
    where: {
      isOnline: {
        in: ["Online", "Not Available", "Do Not Disturb"],
      },
    },
  });

  const coursess = await getCourses({
    userId,
    ...searchParams,
    containerId: process.env.CONTAINER_ID,
  });

  // coursess?.map((each) =>
  //   each?.chapters?.map((sub) => console.log("=-=--------", sub))
  // );

  return (
    <div className="space-y-4 p-4 dark:bg-[#110524]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          icon={Clock}
          label={currentLanguage?.infocard_inprogress}
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label={currentLanguage?.infocard_completed}
          numberOfItems={completedCourses.length}
          variant="success"
        />
        <InfoCard
          icon={ListChecks}
          label={currentLanguage?.infocard_completedChapters}
          numberOfItems={UserProgressCompletedChapters}
          variant="default"
        />
        <InfoCard
          icon={Users}
          label={currentLanguage?.infocard_currentOnlineUsers}
          numberOfItems={CurrentOnlineUser}
          variant="default"
        />
      </div>
      <PolygonChar colors={container} courses={coursess} />
      <CourseTable courses={purchasedCourses} colors={container} />
    </div>
  );
};

export default Dashboard;
