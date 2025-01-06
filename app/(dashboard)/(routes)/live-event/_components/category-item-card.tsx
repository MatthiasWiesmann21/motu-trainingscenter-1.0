"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip";

interface CategoryItemProps {
  label: string;
  value?: string;
  colorCode: string;
}

export const CategoryItemCard = ({
  label,
  value,
  colorCode,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams?.get("categoryId");
  const currentTitle = searchParams?.get("title");

  const isSelected = currentCategoryId === value;

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

  return (
    <TooltipProvider>
      <button
        onClick={onClick}
        className={`flex items-center rounded-lg border-2 px-2 py-1 text-xs`}
        style={{ borderColor: colorCode }}
        type="button"
      >
        <Tooltip>
          <TooltipTrigger>
            <div className="line-clamp-1 text-start text-xs">{label}</div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <div className="text-start text-xs whitespace-normal">{label}</div>
          </TooltipContent>
        </Tooltip>
      </button>
    </TooltipProvider>
  );
};
