import { Category } from "@prisma/client";
import { CategoryItem } from "./category-item";
import { useTheme } from "next-themes";

interface CategoriesProps {
  items: Category[] | any[];
  ThemeOutlineColor: string;
  DarkThemeOutlineColor: string;
}

export const Categories = ({
  items,
  ThemeOutlineColor,
  DarkThemeOutlineColor,
}: CategoriesProps) => {
  const all =
    items
      ?.map((each) => each?._count?.LiveEvent ?? 0)
      ?.reduce((accumulator, currentValue) => accumulator + currentValue, 0) ??
    0;
  const { theme } = useTheme();
  const getThemeColor = () => {
    return theme === "dark" ? DarkThemeOutlineColor : ThemeOutlineColor;
  };
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2 no-scrollbar">
      <CategoryItem label={"all"} colorCode={getThemeColor()} count={all} />
      {items.map((item) => {
        return (
          <CategoryItem
            key={item.id}
            label={item.name}
            value={item.id}
            colorCode={item.colorCode}
            count={item?._count?.LiveEvent}
          />
        );
      })}
    </div>
  );
};
