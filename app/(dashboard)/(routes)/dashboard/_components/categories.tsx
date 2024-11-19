"use client";

import { Category } from "@prisma/client";
import { CategoryItem } from "./category-item";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from "lucide-react";

interface EnhancedCategory extends Category {
  _count: {
    courses: number;
  };
}

interface CategoriesProps {
  items: EnhancedCategory[];
  ThemeColor: string;
  DarkThemeColor: string;
}

export const Categories = ({
  items,
  ThemeColor,
  DarkThemeColor,
}: CategoriesProps) => {
  const all =
    items
      ?.map((each) => each?._count?.courses ?? 0)
      ?.reduce((accumulator, currentValue) => accumulator + currentValue, 0) ?? 0;

  const { theme } = useTheme();
  const getThemeColor = () => {
    return theme === "dark" ? DarkThemeColor : ThemeColor;
  };

  // Ref für den scrollbaren Container
  const scrollRef = useRef<HTMLDivElement>(null);

  // Funktionen für Scroll-Buttons
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex items-center justify-start w-full sm:w-full md:w-[540px] lg:w-[700px] xl:w-[800px]">
      {/* Button zum Scrollen nach links */}
      <Button
        onClick={scrollLeft}
        className="p-2 mb-1 mr-2 rounded-full hover:text-slate-600 text-slate-400 dark:text-slate-200"
        variant="ghost"
      >
        <ChevronLeftCircleIcon size={14} className="h-6 w-6" />
      </Button>

      <div
        ref={scrollRef}
        className="no-scrollbar flex-grow flex-start flex items-center gap-x-2 overflow-x-auto pb-1 scroll-smooth"
      >
        <CategoryItem
          label={"All"}
          colorCode={getThemeColor()}
          categoryAmmount={all}
        />
        {items.map((item) => (
          <CategoryItem
            key={item.id}
            label={item.name}
            value={item.id}
            colorCode={item.colorCode}
            categoryAmmount={item._count.courses}
          />
        ))}
      </div>

      {/* Button zum Scrollen nach rechts */}
      <Button
        onClick={scrollRight}
        className="p-2 mb-1 ml-2 rounded-full hover:text-slate-600 text-slate-400 dark:text-slate-200"
        variant="ghost"
      >
        <ChevronRightCircleIcon size={14} className="h-6 w-6" />
      </Button>
    </div>
  );
};
