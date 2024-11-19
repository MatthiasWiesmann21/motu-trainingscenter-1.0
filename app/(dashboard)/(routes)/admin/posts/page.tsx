import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { isOwner } from "@/lib/owner";
import authOptions from "@/lib/auth"; // Ensure this is configured correctly

const PostsPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/search");
  }

  const isRoleAdmins = await isAdmin();
  const isRoleOperator = await isOperator();
  const isRoleClientAdmin = await isClientAdmin();
  const canAccess = isRoleAdmins || isRoleOperator || isRoleClientAdmin || await isOwner(userId);

  if (!canAccess) {
    return redirect("/search");
  } 

  const posts = await db.post.findMany({
    where: {
      containerId: session?.user?.profile?.containerId,
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={posts} profileRole={session?.user?.profile?.role} />
    </div>
  );
};

export default PostsPage;
