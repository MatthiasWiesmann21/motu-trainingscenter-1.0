import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
import { getSearchCourses } from "@/actions/get-searchcourses";
import { languageServer } from "@/lib/check-language-server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Categories } from "../_components/categories";
import { db } from "@/lib/db";
import getBase64 from "@/lib/getLocalbase64";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const CourseListPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const currentLanguage = await languageServer();

  const courses = await getSearchCourses({
    userId,
    ...searchParams,
  });

  const categoriesWithCourseCounts = await db.category.findMany({
    where: {
      isPublished: true,
      isCourseCategory: true,
      containerId: process.env.CONTAINER_ID,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: { courses: true }, // Ensure 'courses' matches your schema relation name
      },
    },
  });

  const container = await db?.container?.findUnique({
    where: {
      id: process.env.CONTAINER_ID,
    },
  });

  const purchasedCourses = courses.filter((course) => course.isPurchased);

  return (
    <div className="space-y-4 p-6 dark:bg-[#110524]">
      <Link
        href={`/dashboard`}
        className="mb-6 flex items-center text-sm transition hover:opacity-75"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {currentLanguage.courses_list_backToDashboard_button_text}
      </Link>
      <Categories
        items={categoriesWithCourseCounts}
        ThemeOutlineColor={container?.ThemeOutlineColor!}
        DarkThemeOutlineColor={container?.DarkThemeOutlineColor!}
      />
      <CoursesList
        items={purchasedCourses}
        ThemOutlineColor={container?.ThemeOutlineColor!}
        DarkThemeOutlineColor={container?.DarkThemeOutlineColor!}
      />
    </div>
  );
};

export default CourseListPage;
