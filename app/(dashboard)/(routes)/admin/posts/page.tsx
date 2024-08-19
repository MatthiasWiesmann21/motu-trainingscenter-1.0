import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { isAdmin, isOperator } from "@/lib/roleCheckServer";
import { isOwner } from "@/lib/owner";

const PostsPage = async () => {
  const { userId } = auth();

  const isRoleAdmins = await isAdmin();
  const isRoleOperator = await isOperator();
  const canAccess = isRoleAdmins || isRoleOperator || isOwner(userId);

  if (!userId || !canAccess) {
   return redirect("/search");
  }

  const posts = await db.post.findMany({
    where: {
      containerId: process.env.CONTAINER_ID,
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  return ( 
    <div className="p-6">
      <DataTable columns={columns} data={posts} />
    </div>
   );
}
 
export default PostsPage;