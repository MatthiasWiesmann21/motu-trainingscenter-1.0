import { Category, LiveEvent } from "@prisma/client";
import { EventCard } from "@/components/events-card";
import { useLanguage } from "@/lib/check-language";
import { VideoOff } from "lucide-react";

type EventsWithProgressWithCategory = LiveEvent & {
  category: Category | null;
  currentFavorite: boolean;
};

interface EventsListProps {
  items: EventsWithProgressWithCategory[];
  ThemeColor: string;
  DarkThemeColor: string;
  getLiveEvents: any;
}

export const EventsList = ({
  items,
  ThemeColor,
  DarkThemeColor,
  getLiveEvents,
}: EventsListProps) => {
  const currentLanguage = useLanguage();
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full h-full">
      {items.map((item: any) => (
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
          ThemeColor={ThemeColor!}
          DarkThemeColor={DarkThemeColor!}
          currentFavorite={item?.currentFavorite}
          getLiveEvents={getLiveEvents}
        />
      ))}
      {items.length === 0 && (
        <div className="mt-10 flex flex-col items-center justify-center text-sm text-muted-foreground">
          <VideoOff className="h-8 w-8 text-slate-500 dark:text-slate-600" />
          <p className="mt-2 text-md font-medium">
            {currentLanguage.no_events_found}
          </p>
        </div>
      )}
    </div>
  );
};