import { redirect } from "next/navigation";
import { ArrowLeft, User2Icon } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";

import { TitleForm } from "./_components/title-form";
import { languageServer } from "@/lib/check-language-server";
import { currentProfile } from "@/lib/current-profile";
import { EmailForm } from "./_components/email-form";
import { ImageForm } from "./_components/image-form";
import Link from "next/link";
import GoBackButton from "@/components/goBackButton";
import { NewPasswordForm } from "./_components/newPassword-form";
import { DeleteProfileForm } from "./_components/deleteProfile-form";

const UserNamePage = async () => {
  const user = await currentProfile();
  const currentLanguage = await languageServer();
  if (!user?.id) {
    return redirect("/auth/sign-in");
  }

  const profile = await db.profile.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!profile) {
    return redirect("/sign-up");
  }

  return (
    <div className="p-4">
      <GoBackButton buttonText={currentLanguage.goBack_button_text} />
      <div className="mt-8 items-center justify-center">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={User2Icon} />
            <h2 className="text-xl">
              {currentLanguage.profile_change_customize_username}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TitleForm initialData={profile} profileId={profile.id} />
              <EmailForm initialData={profile} profileId={profile.id} />
              <NewPasswordForm initialData={profile} />
            </div>
            <div>
              <ImageForm initialData={profile} profileId={profile.id} />
            </div>
          </div>
          <div>
            <div>
              <DeleteProfileForm profileId={profile.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNamePage;
