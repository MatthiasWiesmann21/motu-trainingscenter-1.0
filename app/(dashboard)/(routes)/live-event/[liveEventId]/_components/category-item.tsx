"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CategoryItemProps {
  label: string;
  value?: string;
  colorCode: string;
}

export const CategoryItem = ({
  label,
  value,
  colorCode,
}: CategoryItemProps) => {
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams?.get("categoryId");

  const isSelected =
    currentCategoryId === value || (!value && !currentCategoryId);

  

  return (
    <div
      className="flex border-2 items-center gap-x-1 rounded-full border-slate-300 p-2 text-sm transition hover:border-sky-700 line-clamp-1"
      style={ {borderColor: colorCode }}
    >
      <div className="truncate">{label?.toUpperCase()}</div>
    </div>
  );
};
