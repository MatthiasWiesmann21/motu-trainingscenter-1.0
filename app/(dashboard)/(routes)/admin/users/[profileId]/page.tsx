import { redirect } from "next/navigation";
import { AlertTriangle, ArrowLeft, User2Icon } from "lucide-react";
import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Actions } from "./_components/actions";
import { TitleForm } from "./_components/title-form";
import { MailForm } from "./_components/mail-form";
import { RoleForm } from "./_components/role-form";
import { IsBannedForm } from "./_components/isBanned-form";
import { languageServer } from "@/lib/check-language-server";
import Link from "next/link";
import GoBackButton from "@/components/goBackButton";
import { UsergroupForm } from "./_components/usergroup-form";

const UserIdPage = async ({ params }: { params: { profileId: string } }) => {
  const currentLanguage = await languageServer();

  const profile = await db.profile.findUnique({
    where: {
      id: params.profileId,
    },
  });

  if (!profile) {
    return redirect("/");
  }

  const usergroups = await db.usergroup.findMany({
    where: {
      containerId: profile?.containerId,
    },
    orderBy: {
      name: "asc",
    },
  });

  const requiredFields = [profile.name, profile.email];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="p-6">
        <GoBackButton buttonText={currentLanguage.goBack_button_text} />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              {currentLanguage.user_setup_title}
            </h1>
            <span className="text-sm text-slate-700 dark:text-[#ffffff]">
              {currentLanguage.user_setup_undertitle} {completionText}
            </span>
          </div>
          <Actions disabled={!isComplete} profileId={params.profileId} />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={User2Icon} />
              <h2 className="text-xl">
                {currentLanguage.user_setup_customize_title}
              </h2>
            </div>
            <TitleForm
              initialData={profile}
              profileId={profile.id}
            />
            <MailForm initialData={profile} profileId={profile.id} />
            <RoleForm
              initialData={profile}
              profileId={profile.id}
              options={[
                { label: "CLIENT ADMIN", value: "CLIENT ADMIN" },
                { label: "ADMIN", value: "ADMIN" },
                { label: "OPERATOR", value: "OPERATOR" },
                { label: "MODERATOR", value: "MODERATOR" },
                { label: "USER", value: "USER" },
              ]}
            />
            <UsergroupForm 
              initialData={profile}
              profileId={profile.id}
              options={usergroups.map((usergroup) => ({
                label: usergroup.name,
                value: usergroup.id,
              }))}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge variant="danger" icon={AlertTriangle} />
              <h2 className="text-xl">
                {currentLanguage.user_setup_settings_title}
              </h2>
            </div>
            <IsBannedForm
              initialData={profile}
              profileId={profile.id}
              options={[
                { label: "BANNED", value: "BANNED" },
                { label: "NOT BANNED", value: "NOT BANNED" },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserIdPage;
