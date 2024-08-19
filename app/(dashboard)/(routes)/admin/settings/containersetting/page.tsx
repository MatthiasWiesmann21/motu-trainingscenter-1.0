import { IconBadge } from "@/components/icon-badge";
import { LinkForm } from "./_components/link-form";
import { ImageForm } from "./_components/image-form";
import { auth } from "@clerk/nextjs";
import { languageServer } from "@/lib/check-language-server";
import { isAdmin, isOperator } from "@/lib/roleCheckServer";
import { isOwner } from "@/lib/owner";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft, Image, LayoutGridIcon } from "lucide-react";
import Link from "next/link";
import { ImageFormDark } from "./_components/image-form-dark";
import { ImageFormIcon } from "./_components/image-form-icon";

const ContainerSettingsPage = async () => {
    const { userId } = auth();
    const currentLanguage = await languageServer();
    const isRoleAdmins = await isAdmin();
    const isRoleOperator = await isOperator();
    const canAccess = isRoleAdmins || isRoleOperator || isOwner(userId);

    if (!userId || !canAccess) {
        return redirect("/admin/customize");
    }

    const container = await db.container.findUnique({
        where: {
            id: process.env.CONTAINER_ID,
        }
    });

    if (!container) {
        return redirect("/");
    }

    const requiredFields = [
        container.link,
        container.imageUrl,
        container.imageUrlDark,
      ];
    
      const totalFields = requiredFields.length;
      const completedFields = requiredFields.filter(Boolean).length;
    
      const completionText = `(${completedFields}/${totalFields})`;
    
      const isComplete = requiredFields.every(Boolean);
    
    return ( 
        <div className="p-6">
        <Link
          href={"/admin/settings"}
          className="flex items-center text-sm hover:opacity-75 transition mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
              {currentLanguage.settings_backToAdminSettings_button_text}
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              {currentLanguage?.customize_customizeCcontainer_title}
            </h1>
            <span className="text-sm text-slate-700 dark:text-[#ffffff]">
              {currentLanguage?.customize_customizeCcontainer_requiredFields} {completionText}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutGridIcon} />
              <h2 className="text-xl">
                {currentLanguage?.customize_customizeYourCcontainer}
              </h2>
              <span className="pl-1 text-xs text-rose-600">{currentLanguage?.requiredFields}</span>
            </div>
            <LinkForm
                initialData={{ link: container.link || "" }}
                containerId={container.id}
            />
            <ImageFormIcon
              initialData={container}
              containerId={container.id}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Image} />
              <h2 className="text-xl">
                {currentLanguage.customize_AddImageTitle}
              </h2>
              <span className="pl-1 text-xs text-rose-600">{currentLanguage?.requiredFields}</span>
            </div>
            <ImageForm
              initialData={container}
              containerId={container.id}
              />
            <ImageFormDark 
              initialData={container}
              containerId={container.id}
            />
          </div>
        </div>
        </div>
     );
}
 
export default ContainerSettingsPage;