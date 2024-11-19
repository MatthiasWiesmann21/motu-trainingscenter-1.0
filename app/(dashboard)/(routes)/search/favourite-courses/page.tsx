import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { Metadata } from "next";
import { FavouriteCoursesList } from "./_components/favouriteCourse-list";

export const metadata: Metadata = {
  title: "Courses",
};

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const FavoriteCoursesPage = async ({ searchParams }: SearchPageProps) => {
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

  const containerColors: any = await db?.container?.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  });

  return (
    <div className="space-y-4 p-4">
      <FavouriteCoursesList
        ThemeColor={containerColors?.ThemeColor!}
        DarkThemeColor={containerColors?.DarkThemeColor!}
        profileRole={profile?.role!}
      />
    </div>
  );
};

export default FavoriteCoursesPage;
