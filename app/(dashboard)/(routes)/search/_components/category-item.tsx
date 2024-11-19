"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/tooltip";
import { text } from "stream/consumers";
import { useTheme } from "next-themes";

interface CategoryItemProps {
  label: string;
  value?: string;
  colorCode: string;
  textColorCode: string;
  darkTextColorCode: string;
  categoryAmmount: number;
}

export const CategoryItem = ({
  label,
  value,
  colorCode,
  textColorCode,
  darkTextColorCode,
  categoryAmmount,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  const getTextColor = () => {
    return theme === "dark" ? darkTextColorCode : textColorCode;
  };

  const currentCategoryId = searchParams?.get("categoryId");
  const currentTitle = searchParams?.get("title");

  const isSelected =
    currentCategoryId === value || (!value && !currentCategoryId);

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        // @ts-ignore
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  const buttonStyle = isSelected
    ? { borderColor: colorCode, background: colorCode, color: getTextColor() }
    : { borderColor: isHovered ? colorCode : "", background: isHovered ? colorCode : 'transparent', color: isHovered ? getTextColor() : "" };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex max-w-xs items-center gap-x-1 rounded-lg border-2 p-2 text-xs font-medium transition duration-300"
            style={buttonStyle}
          >
            <div className="truncate">{label?.toUpperCase()}</div>
            <div>({categoryAmmount})</div>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-xs text-start whitespace-normal">{label?.toUpperCase()}</span>
          <span> ({categoryAmmount})</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
