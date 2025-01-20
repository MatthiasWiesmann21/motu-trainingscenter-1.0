import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import Link from "next/link";

import { getAnalytics } from "@/actions/get-analytics";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { languageServer } from "@/lib/check-language-server";
import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { MenuRoutes } from "./menu-routes";

const AnalyticsPage = async () => {
  const session = await getServerSession(authOptions);
  const currentLanguage = await languageServer();
  const userId = session?.user.id || ''; 
  const isRoleAdmins = await isAdmin();
  const isRoleOperator = await isOperator();
  const isRoleClientAdmin = await isClientAdmin();
  const canAccess = isRoleAdmins || isRoleOperator || isRoleClientAdmin || (userId && await isOwner(userId));

  if (!canAccess) {
    return redirect("/search");
  }

  const container = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  });

  if (!container) {
    return redirect("/");
  }

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              {currentLanguage?.analytics_overviewContainer_title}
            </h1>
          </div>
        </div>
        <MenuRoutes container={container}/>
      </div>
    </>
  );
};

export default AnalyticsPage;