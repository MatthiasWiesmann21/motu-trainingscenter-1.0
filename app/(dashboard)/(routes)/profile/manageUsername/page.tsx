import { redirect } from "next/navigation";
import { User2Icon } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";

import { TitleForm } from "./_components/title-form";
import { languageServer } from "@/lib/check-language-server";
import { currentProfile } from "@/lib/current-profile";

const UserNamePage = async () => {
  const user = await currentProfile();
  const currentLanguage = await languageServer();
  if (!user?.id) {
    return redirect("/");
  }

  const profile = await db.profile.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!profile) {
    return redirect("/");
  }

  return (
    <div className="p-4">
      <div className="mt-8 justify-center items-center">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={User2Icon} />
            <h2 className="text-xl">
              {currentLanguage.profile_change_customize_username}
            </h2>
          </div>
          <TitleForm
            initialData={profile}
            profileId={profile.id}
          />
        </div>
      </div>
    </div>
  );
};

export default UserNamePage;
