import { Category, LiveEvent } from "@prisma/client";

import { EventCard } from "@/components/events-card";

type EventsWithProgressWithCategory = LiveEvent & {
  category: Category | null;
};

interface EventsListProps {
  items: EventsWithProgressWithCategory[];
  ThemeOutlineColor: string;
  DarkThemeOutlineColor: string;
}

export const EventsList = ({ items, ThemeOutlineColor, DarkThemeOutlineColor }: EventsListProps) => {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {items.map((item: any) => (
          <EventCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            category={item?.category?.name!}
            categoryColorCode={item?.category?.colorCode!}
            startDateTime={item?.startDateTime}
            endDateTime={item?.endDateTime}
            color={item?.color}
            ThemOutlineColor={ThemeOutlineColor!}
            DarkThemeOutlineColor={DarkThemeOutlineColor!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          No Events found
        </div>
      )}
    </div>
  );
};
