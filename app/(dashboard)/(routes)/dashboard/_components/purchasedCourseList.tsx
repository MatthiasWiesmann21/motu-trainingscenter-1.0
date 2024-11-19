import { Category, Course } from "@prisma/client";
import { languageServer } from "@/lib/check-language-server";
import { CourseCard } from "@/components/course-card";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
  };

interface CoursesListProps {
  items: CourseWithProgressWithCategory[] | any[];
  ThemeColor: string;
  DarkThemeColor: string;
}

export const PurchasedCoursesList = async ({ items, ThemeColor, DarkThemeColor }: CoursesListProps) => {
  const currentLanguage = await languageServer();
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {items.map((item) => (
          <CourseCard
          key={item.id}
          id={item.id}
          title={item.title}
          imageUrl={item.imageUrl!}
          description={item.description!}
          category={item?.category?.name!}
          categoryColorCode={item?.category?.colorCode!}
          progress={item.progress}
          chaptersLength={item.chapters.length}
          price={item.price!}
          duration={item?.duration!}
          level={item?.level!}
          isFeatured={item?.isFeatured!}
          isBestseller={item?.isBestseller!}
          isNew={item?.isNew!}
          currentFavorite={item?.currentFavorite!}
          ThemeColor={ThemeColor!}
          DarkThemeColor={DarkThemeColor!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          {currentLanguage?.no_courses}
        </div>
      )}
    </div>
  );
};