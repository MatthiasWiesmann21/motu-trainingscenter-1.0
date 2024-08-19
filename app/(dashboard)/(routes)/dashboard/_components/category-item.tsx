"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/tooltip";

interface CategoryItemProps {
  label: string;
  value?: string;
  colorCode: string;
  categoryAmmount: number;
}

export const CategoryItem = ({
  label,
  value,
  colorCode,
  categoryAmmount,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isHovered, setIsHovered] = useState(false);

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
    ? { borderColor: colorCode, background: colorCode }
    : { borderColor: "#cbd5e1", background: isHovered ? colorCode : 'transparent' };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex max-w-xs items-center gap-x-1 rounded-full border p-2 text-xs font-medium transition hover:border-0`}
            style={buttonStyle}
            type="button"
          >
            <div className="truncate">{label?.toUpperCase()}</div>
            <div>({categoryAmmount})</div>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-xs text-start whitespace-normal">{label?.toUpperCase()}</span>
          <span> ({categoryAmmount})</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
