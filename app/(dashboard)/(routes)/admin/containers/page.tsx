import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { isOwner } from "@/lib/owner";
import { isAdmin, isOperator } from "@/lib/roleCheckServer";

const ContainerPage = async () => {
  const { userId } = auth();
  const canAccess = isOwner(userId);

  if (!userId || !canAccess) {
   return redirect("/admin/courses");
  }

  const containers = await db.container.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    canAccess ? (
      <div className="p-6">
      <DataTable columns={columns} data={containers} />
    </div>
    ) : (
      <div className="flex flex-col justify-center items-center text-center min-h-full">
        <h1 className="text-slate-500 text-2xl">Unauthorized</h1>
        <p className="text-slate-500 text-md align">You are not authorized to view this page. Only the Owner have the authorization.</p>  
      </div>
    )
   );
}
 
export default ContainerPage;