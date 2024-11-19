import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { languageServer } from "@/lib/check-language-server";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { MenuRoutes } from "./menu-routes";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

const CustomizeMenuPage = async () => {
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
