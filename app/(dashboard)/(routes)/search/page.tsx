import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { CoursesList } from "@/components/courses-list";
import { Categories } from "./_components/categories";
import { Metadata } from "next";
import { CourseCounter } from "@/components/courseCounter";
import { useLanguage } from "@/lib/check-language";
import { Button } from "@/components/ui/button";
import { languageServer } from "@/lib/check-language-server";
import Link from "next/link";
import { signOut } from "next-auth/react";

export const metadata: Metadata = {
  title: "Courses",
};

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const currentLanguage = await languageServer();
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

  const container: any = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
      courses: {
        some: {},
      },
    },
  });

  const existingCourses = await db.course.count({
    where: {
      containerId: session?.user?.profile?.containerId,
    },
  });

  const categoriesWithCourseCounts = await db.category.findMany({
    where: {
      isPublished: true,
      isCourseCategory: true,
      containerId: session?.user?.profile?.containerId,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          courses: {
            where: {
              isPublished: true
            }
          }
        },
      },
    },
  });
  
  return (
    <>
      <div className="space-y-4 p-4">
        <CourseCounter
          maxCourses={container?.maxCourses ?? 0}
          courses={existingCourses}
          isFrontend
        />
        <div className="flex gap-2 mb-2 max-w-3xl mx-auto lg:mr-auto lg:ml-0">
          <Link
            className="w-full h-8 flex items-center justify-center rounded-full border-2 text-xs transition duration-300 ease-in-out hover:bg-slate-200 dark:hover:bg-slate-700"
            href={"/search/favourite-courses"}
            >
            {currentLanguage.dashboard_courseTable_viewMyFavourties_button_text}
          </Link>
          <Link
            className="w-full h-8 flex items-center justify-center rounded-full border-2 text-xs transition duration-300 ease-in-out hover:bg-slate-200 dark:hover:bg-slate-700"
            href={"/dashboard/favourite-chapters"}
            >
            {currentLanguage.dashboard_courseTable_viewFavoriteChapters_button_text}
          </Link>
        </div>
        <div className="flex w-full">
          <div className="w-full">
          <Categories
            items={categoriesWithCourseCounts}
            ThemeColor={container?.ThemeColor!}
            DarkThemeColor={container?.DarkThemeColor!}
          />
          </div>
        </div>
        <CoursesList
          ThemeColor={container?.ThemeColor!}
          DarkThemeColor={container?.DarkThemeColor!}
          searchParams={searchParams}
        />
      </div>
    </>
  );
};

export default SearchPage;