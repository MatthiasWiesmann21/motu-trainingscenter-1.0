"use client";

import { Category } from "@prisma/client";
import { CategoryItem } from "./category-item";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnhancedCategory extends Category {
  _count: {
    courses: number;
  };
}

interface CategoriesProps {
  items: EnhancedCategory[];
  DarkThemeColor: string;
  ThemeColor: string;
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

  const getTextColor = () => {
    return theme === "dark" ? "#ffffff" : "#000000";
  };

  // Ref for the scrollable container
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll functions
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
    <div className="relative flex items-center justify-start w-full">
      {/* Scroll left button */}
      <Button
        onClick={scrollLeft}
        className="p-2 mb-1 mr-2 rounded-full hover:text-slate-600 text-slate-400 dark:text-slate-200"
        variant="ghost"
      >
        <ChevronLeftCircleIcon size={14} className="h-6 w-6" />
      </Button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex-grow flex-start flex items-center gap-x-2 overflow-x-auto pb-1 scroll-smooth"
      >
        {/* 'All' Category Item */}
        <CategoryItem
          label={"All"}
          colorCode={getThemeColor()}
          textColorCode={getTextColor()}
          darkTextColorCode={getTextColor()}
          categoryAmmount={all}
        />
        
        {/* Individual Category Items */}
        {items.map((item) => (
          <CategoryItem
            key={item.id}
            label={item.name}
            value={item.id}
            colorCode={item.colorCode}
            textColorCode={item.textColorCode}
            darkTextColorCode={item.darkTextColorCode}
            categoryAmmount={item._count.courses}
          />
        ))}
      </div>

      {/* Scroll right button */}
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
