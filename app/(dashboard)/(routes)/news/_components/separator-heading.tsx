"use client";

import { Separator } from "@/components/ui/separator";

interface SeparatorHeadingProps {
  title: string;
}

export const SeparatorHeading = ({ title }: SeparatorHeadingProps) => {
  return (
    <div className="flex flex-row items-center gap-4">
      <Separator className="flex-1" />
      <h4 className="text-sm font-semibold text-muted-foreground whitespace-nowrap">{title}</h4>
      <Separator className="flex-1" />
    </div>
  );
};