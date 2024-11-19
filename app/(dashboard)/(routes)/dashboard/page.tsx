import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { InfoCard } from "./_components/info-card";
import { getSearchCourses } from "@/actions/get-searchcourses";
import { db } from "@/lib/db";
import { languageServer } from "@/lib/check-language-server";
import PolygonChar from "./_components/polygonChar";
import CourseTable from "./_components/courseTable";
import { getCourses } from "@/actions/get-courses";
import authOptions from "@/lib/auth";
import { OnlineCard } from "./_components/onlineCard";
import { currentProfile } from "@/lib/current-profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const Dashboard = async ({ searchParams }: SearchPageProps) => {
  const currentLanguage = await languageServer();
  const profile = await currentProfile();
  const profileId = profile?.id ?? "guest";
  // console.log("profileId", profileId);

  // Check user session
  const session = await getServerSession(authOptions);
  // console.log("user session", session);
  if (!session?.user) {
    return redirect("/");
  }
  if (!session?.user?.role) {
    session.user.role = session?.user?.profile?.role || "USER";
  }

  const userId = session.user.id;
  const userEmail = session.user.email;

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
      id: session?.user?.profile?.containerId,
    },
  });

  const UserProgressCompletedChapters = await db.userProgress.count({
    where: {
      userId,
      isCompleted: true,
    },
  });

  const coursess = await getCourses({
    userId,
    ...searchParams,
    containerId: session?.user?.profile?.containerId,
  });

  const isEmailVerified = await db.profile.findFirst({
    where: {
      userId: userId,
      emailVerified: true,
    },
  });

  return (
    <div className="space-y-4 p-4 dark:bg-[#110524]">
      {!isEmailVerified && (
        <div
          className="mb-4 flex items-center rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <svg
            className="me-3 inline h-4 w-4 flex-shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only"></span>
          <div>
            <span className="font-bold font-medium">
              Please verify Your Email
            </span>
            <div className="font-medium">
              An email is sent to &nbsp;
              <span className="font-bold capitalize underline">
                {userEmail}
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          icon={"Clock"}
          label={"infocard_inprogress"}
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={"CheckCircle"}
          label={"infocard_completed"}
          numberOfItems={completedCourses.length}
          variant="success"
        />
        <InfoCard
          icon={"ListChecks"}
          label={"infocard_completedChapters"}
          numberOfItems={UserProgressCompletedChapters}
          variant="default"
        />
        <OnlineCard profileId={profileId} />
      </div>
      <PolygonChar colors={container} courses={coursess} />
      <CourseTable courses={purchasedCourses} colors={container} />
    </div>
  );
};

export default Dashboard;
