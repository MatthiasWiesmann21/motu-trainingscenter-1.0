import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import qs from "query-string";
import { useRef, useState } from "react";

interface CategoriesProps {
  items: Category[] | any[];
  ThemeColor: string;
  DarkThemeColor: string;
}

export const Categories = ({
  items,
  ThemeColor,
  DarkThemeColor,
}: CategoriesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentCategoryId = searchParams?.get("categoryId");
  const currentTitle = searchParams?.get("title");
  const { theme } = useTheme();
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const all =
    items
      ?.map((each) => each?._count?.LiveEvent ?? 0)
      ?.reduce((accumulator, currentValue) => accumulator + currentValue, 0) ??
    0;

  const getThemeColor = () => {
    return theme === "dark" ? DarkThemeColor : ThemeColor;
  };

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
    <div className="relative flex w-full items-center justify-start">
      {/* Button for scrolling left */}
      <Button
        onClick={scrollLeft}
        className="mb-1 mr-2 rounded-full p-2 text-slate-400 hover:text-slate-600 dark:text-slate-200"
        variant="ghost"
      >
        <ChevronLeftCircleIcon size={14} className="h-6 w-6" />
      </Button>

      <div
        ref={scrollRef}
        className="no-scrollbar flex flex-grow items-center justify-start gap-x-2 overflow-x-auto scroll-smooth pb-1"
      >
        <button
          onClick={() => {
            router?.push(
              qs?.stringifyUrl(
                {
                  // @ts-ignore
                  url: pathname,
                  query: {
                    title: currentTitle,
                    categoryId: null,
                  },
                },
                { skipNull: true, skipEmptyString: true }
              )
            );
          }}
          className={`font-600 flex items-center gap-x-1 rounded-lg border-2 px-3 py-2 text-xs transition duration-300`}
          style={
            !currentCategoryId
              ? { borderColor: getThemeColor(), background: getThemeColor() }
              : {
                  borderColor:
                    hoveredCategoryId === "all" ? getThemeColor() : "",
                  background:
                    hoveredCategoryId === "all" ? getThemeColor() : "",
                }
          }
          onMouseEnter={() => setHoveredCategoryId("all")}
          onMouseLeave={() => setHoveredCategoryId(null)}
          type="button"
        >
          <div className="truncate">All</div>
          <div>({all})</div>
        </button>
        {items?.map((item) => {
          const isSelected =
            currentCategoryId === item?.id || (!item?.id && !currentCategoryId);
          const isHovered = hoveredCategoryId === item?.id;
          const borderColor = isSelected || isHovered ? item?.colorCode : "";
          const backgroundColor =
            isSelected || isHovered ? item?.colorCode : "transparent";
          const onClick = () => {
            const url = qs?.stringifyUrl(
              {
                // @ts-ignore
                url: pathname,
                query: {
                  title: currentTitle,
                  categoryId: isSelected ? null : item?.id,
                },
              },
              { skipNull: true, skipEmptyString: true }
            );

            router?.push(url);
          };
          const getTextColor = () => {
            return theme === "dark"
              ? item?.darkTextColorCode
              : item?.textColorCode;
          };
          const buttonStyle = isSelected
            ? {
                borderColor: borderColor,
                background: backgroundColor,
                color: getTextColor(),
              }
            : {
                borderColor: isHovered ? borderColor : "",
                background: isHovered ? backgroundColor : "transparent",
                color: isHovered ? getTextColor() : "",
              };
          return (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger>
                  <span
                    key={item?.id}
                    onClick={onClick}
                    className={`font-600 flex items-center gap-x-1 rounded-lg border-2 px-3 py-2 text-xs transition duration-300`}
                    style={buttonStyle}
                    onMouseEnter={() => setHoveredCategoryId(item?.id)}
                    onMouseLeave={() => setHoveredCategoryId(null)}
                  >
                    <span className="line-clamp-1 truncate text-start">
                      {item?.name?.toUpperCase()}
                    </span>
                    <div>({item?._count?.LiveEvent})</div>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="whitespace-normal text-start text-sm">
                    {item?.name?.toUpperCase()}
                  </span>
                  <span> ({item?._count?.LiveEvent})</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Button for scrolling right */}
      <Button
        onClick={scrollRight}
        className="mb-1 ml-2 rounded-full p-2 text-slate-400 hover:text-slate-600 dark:text-slate-200"
        variant="ghost"
      >
        <ChevronRightCircleIcon size={14} className="h-6 w-6" />
      </Button>
    </div>
  );
};
