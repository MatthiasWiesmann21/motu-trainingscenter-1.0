"use client";
import { LucideIcon, Clock, CheckCircle, ListChecks } from "lucide-react";
import { useLanguage } from "@/lib/check-language";
import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: string;
}

export const InfoCard = ({
  variant,
  icon,
  numberOfItems,
  label,
}: InfoCardProps) => {
  const currentLanguage = useLanguage();

  // Determine which icon to use
  let Icon: LucideIcon;
  switch (icon) {
    case "CheckCircle":
      Icon = CheckCircle;
      break;
    case "ListChecks":
      Icon = ListChecks;
      break;
    case "Clock":
    default:
      Icon = Clock;
  }

  return (
    <div className="flex items-center gap-x-2 rounded-md border-2 p-3 dark:border-[#221b2e] dark:bg-[#0D071A]">
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="text-sm text-gray-600">{currentLanguage?.[label]}</p>
        <p className="font-medium">{`${
          numberOfItems < 10 ? 0 : ""
        }${numberOfItems}`}</p>
      </div>
    </div>
  );
};
