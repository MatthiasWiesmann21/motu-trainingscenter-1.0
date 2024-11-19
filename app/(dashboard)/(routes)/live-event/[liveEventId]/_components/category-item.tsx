"use client";

import { useSearchParams } from "next/navigation";

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
      className="flex border-2 items-center gap-x-1 rounded-lg border-slate-300 p-2 text-xs transition line-clamp-1"
      style={ {borderColor: colorCode }}
    >
      <div className="truncate">{label?.toUpperCase()}</div>
    </div>
  );
};
