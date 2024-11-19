"use client";

import { AlertTriangle, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isNew?: boolean;
  somethingImportant?: boolean;
  ThemeColor: string;
  DarkThemeColor: string;
}

export const MenuItem = ({
  icon: Icon,
  label,
  href,
  isNew,
  somethingImportant,
  ThemeColor,
  DarkThemeColor,
}: SidebarItemProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const onClick = () => {
    router.push(href);
  };

  const getThemeColor = () => {
    return theme === "dark" ? DarkThemeColor : ThemeColor;
  };

  return (
    <button
      className="rounded-xl border-4 transition duration-500 ease-in-out"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: isHovered ? getThemeColor() : "transparent",
      }}
    >
      <div className="h-full overflow-hidden rounded-lg border-4 bg-transparent p-3 transition hover:shadow-sm dark:border-[#ffffff]">
        <div className="relative w-full overflow-hidden rounded-md">
          <div className="flex items-center justify-center py-6">
            <Icon size={64} />
          </div>
          <div className="flex py-1">
            <h2 className="text-lg font-medium">{label}</h2>
          </div>
        </div>
        <div className="flex justify-start">
          {isNew && (
            <div className="mr-2 inline-flex items-center rounded-md border border-transparent bg-green-500/20 px-2 py-2 text-xs font-medium text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              New
            </div>
          )}
          {somethingImportant && (
            <div className="justify-start">
              <div className="inline-flex items-center rounded-md border border-transparent bg-orange-400/10 px-2 py-2 text-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <AlertTriangle size={16} />
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
