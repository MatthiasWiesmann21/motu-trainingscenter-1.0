import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { isAdmin, isOperator } from "@/lib/roleCheckServer";
import { isOwner } from "@/lib/owner";
import { languageServer } from "@/lib/check-language-server";
import { Button } from "@/components/ui/button";

const LiveEventPage = async () => {
  const { userId } = auth();

  const isRoleAdmins = await isAdmin();
  const isRoleOperator = await isOperator();
  const canAccess = isRoleAdmins || isRoleOperator || isOwner(userId);
  const currentLanguage = await languageServer();
  if (!userId || !canAccess) {
   return redirect("/search");
  }

  const client = await db.container.findUnique({
    where: {
      id: process.env.CONTAINER_ID
    },
  })
  
  if (client?.clientPackage === "STARTER") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-bold mb-2">Live-Event Feature</div>
          <div className="text-lg mb-4">{currentLanguage.liveEvent_PremiumFeature_description}</div>
          <Button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <a href="https://clubyte.live/pricing" className="flex items-center">
              {currentLanguage.liveEvent_PremiumFeature_button_text}
            </a>
          </Button>
      </div>
    )
  }
  const liveEvent = await db.liveEvent.findMany({
    where: {
      containerId: process.env.CONTAINER_ID,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return ( 
    <div className="p-6">
      <DataTable columns={columns} data={liveEvent} />
    </div>
   );
}
 
export default LiveEventPage;