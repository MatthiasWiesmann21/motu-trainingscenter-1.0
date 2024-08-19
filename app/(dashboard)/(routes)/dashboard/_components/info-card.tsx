import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { languageServer } from "@/lib/check-language-server";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
}

export const InfoCard = async ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
}: InfoCardProps) => {

  return (
    <div className="flex items-center gap-x-2 rounded-md border p-3 dark:border-[#221b2e] dark:bg-[#0D071A]">
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{`${
          numberOfItems < 10 && 0
        }${numberOfItems}`}</p>
      </div>
    </div>
  );
};
