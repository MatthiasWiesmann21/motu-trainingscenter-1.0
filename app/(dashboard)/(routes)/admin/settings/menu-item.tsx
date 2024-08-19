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
  ThemeOutlineColor: string;
  DarkThemeOutlineColor: string;
}

export const MenuItem = ({
  icon: Icon,
  label,
  href,
  isNew,
  somethingImportant,
  ThemeOutlineColor,
  DarkThemeOutlineColor,
}: SidebarItemProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const onClick = () => {
    router.push(href);
  };

  const getThemeColor = () => {
    return theme === "dark" ? DarkThemeOutlineColor : ThemeOutlineColor;
  };

  return (
    <button
      className="border-2 rounded-lg transition ease-in-out duration-500"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: isHovered ? getThemeColor() : 'transparent',
      }}
    >
      <div className="hover:shadow-sm transition overflow-hidden border-2 rounded-lg p-3 h-full dark:border-[#ffffff] bg-transparent">
        <div className="relative w-full rounded-md overflow-hidden">
          <div className="flex items-center justify-center py-6">
            <Icon size={64} />
          </div>
          <div className="py-1 flex">
            <h2 className="text-lg font-medium">{label}</h2>
          </div>
        </div>
        <div className="flex justify-start">
          {isNew && (
            <div className="inline-flex items-center rounded-md border px-2 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500/20 text-green-500 mr-2">
              New
            </div>
          )}
          {somethingImportant && (
            <div className="justify-start">
              <div className="inline-flex items-center rounded-md border px-2 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-orange-400/10 text-yellow-500">
                <AlertTriangle size={16} />
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
