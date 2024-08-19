import { languageServer } from "@/lib/check-language-server";
import { db } from "@/lib/db";
import { isOwner } from "@/lib/owner";
import { isAdmin, isOperator } from "@/lib/roleCheckServer";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { MenuRoutes } from "./menu-routes";

const CustomizeMenuPage = async () => {
  const { userId } = auth();
  const currentLanguage = await languageServer();
  const isRoleAdmins = await isAdmin();
  const isRoleOperator = await isOperator();
  const canAccess = isRoleAdmins || isRoleOperator || isOwner(userId);

  if (!userId || !canAccess) {
    return redirect("/search");
  }

  const container = await db.container.findUnique({
    where: {
      id: process.env.CONTAINER_ID,
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
              {currentLanguage?.customize_customizeCcontainer_title}
            </h1>
          </div>
        </div>
            <MenuRoutes container={container}/>
      </div>
    </>
  );
};

export default CustomizeMenuPage;
