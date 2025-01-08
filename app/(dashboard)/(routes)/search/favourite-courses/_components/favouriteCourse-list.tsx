"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/check-language";
import { useSearchParams } from "next/navigation";
import { CourseFavoriteCard } from "@/app/(dashboard)/(routes)/dashboard/_components/courseFavorite-card";
import { Separator } from "@/components/ui/separator";
import { CourseCard } from "@/components/course-card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GoBackButton from "@/components/goBackButton";

interface CoursesListProps {
  ThemeColor: string;
  DarkThemeColor: string;
  profileRole: string;
}

export const FavouriteCoursesList = ({
  ThemeColor,
  DarkThemeColor,
  profileRole,
}: CoursesListProps) => {
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("categoryId") || "";
  const title = searchParams?.get("title") || "";
  const currentLanguage = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [Favorites, setFavorites] = useState<any[]>([]);

  const getAllCourses = async () => {
    const response = await fetch(`/api/search?categoryId=${categoryId}`);
    const data = await response.json();
    setItems(data);
    setFavorites(data?.filter((course: any) => course?.currentFavorite));
  };

  useEffect(() => {
    getAllCourses();
  }, [categoryId, title]);

  return (
    <div>
      <GoBackButton buttonText={currentLanguage.goBack_button_text} />
      {/* My Favorites Section (hidden on mobile) */}
      <div>
        {Favorites?.length > 0 && (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {Favorites?.map((item) => (
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
                getAllCourses={getAllCourses}
              />
            ))}
          </div>
        )}
        {items.length === 0 && (
          <div className="mt-10 text-center text-sm text-muted-foreground">
            {currentLanguage?.no_courses}
          </div>
        )}
      </div>
    </div>
  );
};
