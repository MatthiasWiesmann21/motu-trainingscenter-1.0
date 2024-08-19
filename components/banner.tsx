import { AlertTriangle, CheckCircleIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning:
          "bg-yellow-200/80 border-yellow-30 text-primary dark:text-[#000000]",
        success: "bg-emerald-700 border-emerald-800 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants | any> {
  label: string;
  variant?: string | any;
  className?: string;
  onClick?: any;
}

const iconMap: any = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

export const Banner = ({ label, variant, className, onClick }: BannerProps) => {
  const Icon = iconMap[variant || "warning"];

  return (
    <div
      className={`${cn(bannerVariants({ variant }))} ${className}`}
      onClick={onClick}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </div>
  );
};
