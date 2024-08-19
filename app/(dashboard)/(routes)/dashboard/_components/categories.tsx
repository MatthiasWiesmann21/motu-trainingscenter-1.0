"use client";

import { Category } from "@prisma/client";
import { CategoryItem } from "./category-item";
import { useTheme } from "next-themes";

interface EnhancedCategory extends Category {
  _count: {
    courses: number;
  };
}
interface CategoriesProps {
  items: EnhancedCategory[];
  ThemeOutlineColor: string;
  DarkThemeOutlineColor: string;
}

export const Categories = ({ items, ThemeOutlineColor, DarkThemeOutlineColor }: CategoriesProps) => {
  const all =
    items
      ?.map((each) => each?._count?.courses ?? 0)
      ?.reduce((accumulator, currentValue) => accumulator + currentValue, 0) ??
    0;
    const { theme } = useTheme();
    const getThemeColor = () => {
      return theme === "dark" ? DarkThemeOutlineColor : ThemeOutlineColor;
    };
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2 no-scrollbar">
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
  );
};
