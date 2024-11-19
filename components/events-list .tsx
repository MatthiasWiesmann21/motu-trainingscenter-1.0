import { Category, LiveEvent } from "@prisma/client";
import { EventCard } from "@/components/events-card";
import { useLanguage } from "@/lib/check-language";

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
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
        <div className="mt-10 text-center text-sm text-muted-foreground">
          {currentLanguage.no_events_found}
        </div>
      )}
    </div>
  );
};
