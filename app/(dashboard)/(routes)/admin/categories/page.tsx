import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { isAdmin, isOperator } from "@/lib/roleCheckServer";
import { isOwner } from "@/lib/owner";


const CategoriesPage = async () => {
    const { userId } = auth();

    const isRoleAdmins = await isAdmin();
    const isRoleOperator = await isOperator();
    const canAccess = isRoleAdmins || isRoleOperator || isOwner(userId);
  
    if (!userId || !canAccess) {
     return redirect("/search");
    }

  const category = await db.category.findMany(
    {
      where: {
        containerId: process.env.CONTAINER_ID,
      },
    }
  );

  return ( 
    <div className="p-6">
      {/* @ts-ignore*/}
      <DataTable columns={columns} data={category} />
    </div>
   );
}
 
export default CategoriesPage;