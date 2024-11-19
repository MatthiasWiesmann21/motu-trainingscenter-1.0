import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { isOwner } from "@/lib/owner";
import authOptions from "@/lib/auth"; // Ensure this is correctly configured

const ContainerPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (userId ==! "user_1725647173943") {
    return redirect("/admin/courses");
  }

  const containers = await db.container.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={containers} />
    </div>
  );
};

export default ContainerPage;
