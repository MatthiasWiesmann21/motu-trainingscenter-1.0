import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { Metadata } from "next";
import { FavouriteEventsList } from "./_components/favouriteCourse-list";


export const metadata: Metadata = {
  title: "Live Events",
};

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const FavoriteEventsPage = async ({ searchParams }: SearchPageProps) => {
  // Get the session from NextAuth
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    // Redirect if not authenticated
    return redirect("/");
  }

  const profile = await db.profile.findUnique({
    where: {
      id: userId,
    },
  });

  if (profile?.name === null) {
    // Redirect if profile name is not set
    return redirect("/profile/manageUsername");
  }

  const containerColors = await db?.container?.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  });

  if(containerColors?.clientPackage === "STARTER"){
    return redirect("/dashboard");
  }

  return (
    <div className="space-y-4 p-4">
      <FavouriteEventsList
        ThemeColor={containerColors?.ThemeColor!}
        DarkThemeColor={containerColors?.DarkThemeColor!}
        profileRole={profile?.role!}
      />
    </div>
  );
};

export default FavoriteEventsPage;
