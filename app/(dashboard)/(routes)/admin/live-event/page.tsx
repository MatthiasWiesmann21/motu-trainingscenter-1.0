import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { isOwner } from "@/lib/owner";
import { languageServer } from "@/lib/check-language-server";
import { Button } from "@/components/ui/button";
import authOptions from "@/lib/auth"; // Ensure this is configured correctly

const LiveEventPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const currentLanguage = await languageServer();

  if (!userId) {
    return redirect("/");
  }

  const isRoleAdmins = await isAdmin();
  const isRoleOperator = await isOperator();
  const isRoleClientAdmin = await isClientAdmin();
  const canAccess = isRoleAdmins || isRoleOperator || isRoleClientAdmin || await isOwner(userId);

  if (!canAccess) {
    return redirect("/search");
  }

  const client = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  });

  if (client?.clientPackage === "STARTER") {
    return (
      <div className="flex flex-col items-center justify-center h-screen mx-4">
        <p className="text-2xl font-bold mb-2">Live-Event Feature</p>
        <p className="text-lg mb-4">{currentLanguage.liveEvent_PremiumFeature_description}</p>
        <Button className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <a href="https://clubyte.live/pricing" className="flex items-center">
            {currentLanguage.liveEvent_PremiumFeature_button_text}
          </a>
        </Button>
      </div>
    );
  }

  const liveEvent = await db.liveEvent.findMany({
    where: {
      containerId: session?.user?.profile?.containerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={liveEvent} profileRole={session?.user?.profile?.role} />
    </div>
  );
};

export default LiveEventPage;
