"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/check-language";
import { useSearchParams } from "next/navigation";
import { CourseFavoriteCard } from "@/app/(dashboard)/(routes)/dashboard/_components/courseFavorite-card";
import { Separator } from "@/components/ui/separator";
import { CourseCard } from "@/components/course-card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventCard } from "@/components/events-card";
import GoBackButton from "@/components/goBackButton";

interface EventListProps {
  ThemeColor: string;
  DarkThemeColor: string;
  profileRole: string;
}

export const FavouriteEventsList = ({
  ThemeColor,
  DarkThemeColor,
  profileRole,
}: EventListProps) => {
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("categoryId") || "";
  const title = searchParams?.get("title") || "";
  const currentLanguage = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [Favorites, setFavorites] = useState<any[]>([]);

  const getLiveEvents = async () => {
    const response = await fetch(`/api/liveEvent?categoryId=${categoryId}`);
    const data = await response.json();
    setItems(data);
    setFavorites(data?.filter((event: any) => event?.currentFavorite));
  };

  useEffect(() => {
    getLiveEvents();
  }, [categoryId, title]);

  return (
    <div>
      <GoBackButton buttonText={currentLanguage.goBack_button_text} />
      {/* My Favorites Section (hidden on mobile) */}
      <div>
        {Favorites?.length > 0 && (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {Favorites?.map((item) => (
              <EventCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl!}
                category={item?.category?.name!}
                categoryColorCode={item?.category?.colorCode!}
                startDateTime={item?.startDateTime}
                endDateTime={item?.endDateTime}
                ThemeColor={ThemeColor}
                DarkThemeColor={DarkThemeColor!}
                currentFavorite={item?.currentFavorite}
                getLiveEvents={getLiveEvents}
              />
            ))}
          </div>
        )}
        {items.length === 0 && (
          <div className="mt-10 text-center text-sm text-muted-foreground">
            {currentLanguage.no_events_found}
          </div>
        )}
      </div>
    </div>
  );
};
