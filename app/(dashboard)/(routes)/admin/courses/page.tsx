import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { isOwner } from "@/lib/owner";
import { CourseCounter } from "@/components/courseCounter";
import authOptions from "@/lib/auth"; // Ensure this is correctly configured

const CoursesPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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

  const courses = await db.course.findMany({
    where: {
      containerId: session?.user?.profile?.containerId,
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  const container = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  });

  const existingCourses = await db.course.count({
    where: {
      containerId: session?.user?.profile?.containerId,
    }
  });

  return (
    <div className="p-6">
      <CourseCounter courses={existingCourses} maxCourses={container?.maxCourses ?? 0} />
      <DataTable columns={columns} data={courses} profileRole={session?.user?.profile?.role} />
    </div>
  );
};

export default CoursesPage;
