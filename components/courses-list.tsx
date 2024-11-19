"use client";
import { CourseCard } from "./course-card";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/check-language";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { NewspaperIcon, PlusCircle } from "lucide-react";
import { CourseFavoriteCard } from "@/app/(dashboard)/(routes)/dashboard/_components/courseFavorite-card";
import { Separator } from "./ui/separator";
import axios from "axios";

interface CoursesListProps {
  searchParams: any;
  ThemeColor: string;
  DarkThemeColor: string;
}

export const CoursesList = ({
  ThemeColor,
  DarkThemeColor,
  searchParams,
}: CoursesListProps) => {
  const currentLanguage = useLanguage();
  const [items, setItems] = useState<any[]>([]);

  const getAllCourses = async () => {
    const response = await axios?.get(
      `/api/search?categoryId=${searchParams?.categoryId || ""}&title=${
        searchParams?.title || ""
      }&state=${searchParams?.state}`
    );
    setItems(response?.data);
  };

  useEffect(() => {
    getAllCourses();
  }, [searchParams]);

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
          getAllCourses={getAllCourses}
        />
      ))}
      {items.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          {currentLanguage?.no_courses}
        </div>
      )}
    </div>
  );
};
