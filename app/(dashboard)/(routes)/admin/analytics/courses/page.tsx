import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { getCourses } from "@/actions/get-courses";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { languageServer } from "@/lib/check-language-server";
import authOptions from "@/lib/auth";
import { db } from "@/lib/db";

import GoBackButton from "@/components/goBackButton";
import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

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
    },
  });

  const dashboardCourses = await getDashboardCourses(userId);
  const completedCourses = dashboardCourses.completedCourses.length;

  const totalCourses = allCourses.length;
  const totalPurchases = allCourses.reduce((acc, course) => acc + course.purchases.length, 0);

  const purchaseData = allCourses.map(course => ({
    name: course.title || "Untitled",
    total: course.purchases.length,
  }));

  return (
    <div className="p-6">
      <GoBackButton buttonText={currentLanguage.goBack_button_text} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DataCard
          label="Total Courses"
          value={totalCourses}
        />
        <DataCard
          label="Total Purchases"
          value={totalPurchases}
        />
        <DataCard
          label="Completed Courses"
          value={completedCourses}
        />
      </div>
      <Chart data={purchaseData} />
    </div>
  );
};

export default CourseAnalyticsPage;