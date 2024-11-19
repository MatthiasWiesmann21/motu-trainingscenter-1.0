import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { isOwner } from "@/lib/owner";
import authOptions  from "@/lib/auth"; // Ensure this is properly configured

const UsergroupsPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const isRoleAdmins = await isAdmin();
  const isRoleOperator = await isOperator();
  const isRoleClientAdmin = await isClientAdmin();
  const canAccess = isRoleAdmins || isRoleOperator || isRoleClientAdmin || (userId && await isOwner(userId));

  if (!userId || !canAccess) {
    return redirect("/search");
  }

  const usergroups = await db.usergroup.findMany({
    where: {
      containerId: session?.user?.profile?.containerId,
    },
  });

  return (
    <div className="p-6">
      {/* @ts-ignore */}
      <DataTable columns={columns} data={usergroups} profileRole={session?.user?.profile?.role} />
    </div>
  );
};

export default UsergroupsPage;
