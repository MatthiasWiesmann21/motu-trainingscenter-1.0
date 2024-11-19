import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { isOwner } from "@/lib/owner";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

const UserPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id||null;

  const isRoleAdmins = await isAdmin();
  const isRoleClientAdmin = await isClientAdmin();
  const canAccess = isRoleAdmins || isRoleClientAdmin || (userId && await isOwner(userId));

  if (!canAccess) {
    return redirect("/search");
  }

  const profiles = await db.profile.findMany({
    where: {
      containerId: session?.user?.profile?.containerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={profiles} />
    </div>
  );
};

export default UserPage;
