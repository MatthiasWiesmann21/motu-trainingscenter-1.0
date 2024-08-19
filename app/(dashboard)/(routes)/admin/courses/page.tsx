import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { isAdmin, isOperator } from "@/lib/roleCheckServer";
import { isOwner } from "@/lib/owner";
import { CourseCounter } from "@/components/courseCounter";

const CoursesPage = async () => {
  const { userId } = auth();

  const isRoleAdmins = await isAdmin();
  const isRoleOperator = await isOperator();
  const canAccess = isRoleAdmins || isRoleOperator || isOwner(userId);

  if (!userId || !canAccess) {
   return redirect("/search");
  }

  const courses = await db.course.findMany({
    where: {
      containerId: process.env.CONTAINER_ID,
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  const container = await db.container.findUnique({
    where: {
      id: process.env.CONTAINER_ID,
    },
  });

  const existingCourses = await db.course.count({
    where: {
      containerId: process.env.CONTAINER_ID,
    }
  });

  return ( 
    <div className="p-6">
      <CourseCounter courses={existingCourses} maxCourses={container?.maxCourses ?? 0}/>
      <DataTable columns={columns} data={courses} />
    </div>
   );
}
 
export default CoursesPage;