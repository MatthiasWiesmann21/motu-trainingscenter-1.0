import TabSwitcher from "./_components/tabSwitcher";
import { UserAvatar } from "@/components/user-avatar";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

const CareerPage = async () => {
  const user = await currentProfile();
  const profile = await db.profile.findUnique({
    where: {
      id: user?.id,
    },
  });

  return (
    <div>
      <div className="mx-4 my-4 rounded-lg p-6 shadow dark:bg-[#0d071a]">
        <div
          // style={{ border: "2px solid blue" }}
          className="flex items-center"
        >
          <UserAvatar
            src={profile?.imageUrl}
            className="min-h-64 min-w-64 max-w-64 max-h-64"
          />
          <div
            className="ml-2 flex flex-col justify-center"
            // style={{ border: "3px solid green" }}
          >
            <div className="font-600 text-base text-black dark:text-white">
              {profile?.name}
            </div>
          </div>
        </div>
        <div className="mt-4 text-lg">
          Aktueller Rang: BJJ Blue 
        </div>
      </div>
      <div>
        <TabSwitcher memberId={profile?.name!} />
      </div>
    </div>
  );
};

export default CareerPage;
