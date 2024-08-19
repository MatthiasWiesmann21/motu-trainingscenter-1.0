import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowLeft, User2Icon } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";

import { Actions } from "./_components/actions";
import { TitleForm } from "./_components/title-form";
import { ShowUserMail } from "./_components/showUserMail";
import { RoleForm } from "./_components/role-form";
import { IsBannedForm } from "./_components/isBanned-form";
import { languageServer } from "@/lib/check-language-server";
import Link from "next/link";
import { MemberIDForm } from "./_components/memberID-form";

const UserIdPage = async ({ params }: { params: { profileId: string } }) => {
  const { userId } = auth();
  const currentLanguage = await languageServer();
  if (!userId) {
    return redirect("/");
  }

  const profile = await db.profile.findUnique({
    where: {
      id: params.profileId,
    },
  });

  if (!profile) {
    return redirect("/");
  }

  const requiredFields = [profile.name, profile.email];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="p-6">
      <Link
        href={`/admin/users`}
        className="mb-6 flex items-center text-sm transition hover:opacity-75"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {currentLanguage.user_setup_backToUserAdminList_button_text}
      </Link>
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
        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-2">
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
            <ShowUserMail initialData={profile} profileId={profile.id} />
            <RoleForm
              initialData={profile}
              profileId={profile.id}
              options={[
                { label: "ADMIN", value: "ADMIN" },
                { label: "OPERATOR", value: "OPERATOR" },
                { label: "MODERATOR", value: "MODERATOR" },
                { label: "USER", value: "USER" },
              ]}
            />
            <MemberIDForm
              initialData={profile}
              profileId={profile.id}
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
