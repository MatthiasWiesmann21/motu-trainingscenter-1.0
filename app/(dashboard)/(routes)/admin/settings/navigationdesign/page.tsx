import { redirect } from "next/navigation";
import { ArrowLeft, PaletteIcon } from "lucide-react";
import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { PrimaryNavColorForm } from "./_components/nav-primary-color-form";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { isOwner } from "@/lib/owner";
import { languageServer } from "@/lib/check-language-server";
import { BackgorundNavColorForm } from "./_components/nav-background-color-form";
import { DarkPrimaryNavColorForm } from "./_components/nav-darkPrimary-color-form";
import { DarkBackgorundNavColorForm } from "./_components/nav-darkBackground-color-form";
import Link from "next/link";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

const CustomizeSettingsPage = async () => {
  const session = await getServerSession(authOptions);
  const currentLanguage = await languageServer();
  const userId = session?.user.id || '';
  const isRoleClientAdmin = await isClientAdmin();
  const isRoleAdmins = await isAdmin();
  const isRoleOperator = await isOperator();
  const canAccess = isRoleAdmins || isRoleOperator || isRoleClientAdmin || (userId && await isOwner(userId));
  if (!canAccess) {
    return redirect("/search");
  }
  const container = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    }
  });
  if (!container) {
    return redirect("/");
  }

  return (
    <>
      <div className="p-6">
        <Link
          href={"/admin/settings"}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentLanguage.settings_backToAdminSettings_button_text}
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              {currentLanguage?.customize_customizeNavigation_title}
            </h1>
          </div>
        </div>
        <div className="mt-12">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={PaletteIcon} />
            <h2 className="text-xl">
              {currentLanguage.customize_NavColors_title}
            </h2>
            <span className="pl-1 text-xs text-rose-600">{currentLanguage.requiredFields}</span>
          </div>
          <PrimaryNavColorForm
            initialData={{ navPrimaryColor: container.navPrimaryColor || "#0369a0" }}
            containerId={container.id} 
          />
          <BackgorundNavColorForm 
            initialData={{ navBackgroundColor: container.navBackgroundColor || "#ffffff" }}
            containerId={container.id}
          />
          <div className="flex items-center gap-x-2 pt-6">
            <IconBadge icon={PaletteIcon} />
            <h2 className="text-xl">
              {currentLanguage.customize_NavColorsDark_title}
            </h2>
            <span className="pl-1 text-xs text-rose-600">{currentLanguage.requiredFields}</span>
          </div>
          <DarkPrimaryNavColorForm
            initialData={{ navDarkPrimaryColor: container.navDarkPrimaryColor || "#0369a0" }}
            containerId={container.id}
          />
          <DarkBackgorundNavColorForm
            initialData={{ navDarkBackgroundColor: container.navDarkBackgroundColor || "#ffffff" }}
            containerId={container.id}
          />
        </div>
      </div>
    </>
  );
};

export default CustomizeSettingsPage;
