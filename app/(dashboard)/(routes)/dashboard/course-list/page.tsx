import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
import { getSearchCourses } from "@/actions/get-searchcourses";
import { languageServer } from "@/lib/check-language-server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Categories } from "../_components/categories";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PurchasedCoursesList } from "../_components/purchasedCourseList";
interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const CourseListPage = async ({ searchParams }: SearchPageProps) => {
  const session = await getServerSession(authOptions);


  if (!session?.user?.id) {
    return redirect("/"); // Redirect if no user is found in session
  }

  const currentLanguage = await languageServer();

  const courses = await getSearchCourses({
    userId: session.user.id, // Use session user ID
    ...searchParams,
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
        select: { courses: true }, // Ensure 'courses' matches your schema relation name
      },
    },
  });

  const container = await db?.container?.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
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
        ThemeColor={container?.ThemeColor!}
        DarkThemeColor={container?.DarkThemeColor!}
      />
      <PurchasedCoursesList
        items={purchasedCourses}
        ThemeColor={container?.ThemeColor!}
        DarkThemeColor={container?.DarkThemeColor!}
      />
    </div>
  );
};

export default CourseListPage;
