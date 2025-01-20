"use client";

import {
  BarChart2,
  BookText,
  ImageIcon,
  Newspaper,
  PaletteIcon,
  Settings,
  Video,
} from "lucide-react";

import { useLanguage } from "@/lib/check-language";
import { Container } from "@prisma/client";
import { MenuItem } from "./menu-item";


interface SettingsMenuItemProps {
  container: Container
}

export const MenuRoutes = ({
  container,
}: SettingsMenuItemProps) => {
  const currentLanguage = useLanguage();

  const analyticsCards = [
    {
      icon: BarChart2,
      label: `${currentLanguage.analytics_overviewFinance_title}`,
      href: "/admin/analytics/finance",
      isNew: false,
      somethingImportant: false,
    },
    {
      icon: BookText,
      label: `${currentLanguage.analytics_overviewCourse_title}`,
      href: "/admin/analytics/courses",
      isNew: false,
      somethingImportant: false,
    },
    {
      icon: Video,
      label: `${currentLanguage.analytics_overviewLiveEventAnalytics_title}`,
      href: "/admin/analytics/events",
      isNew: false,
      somethingImportant: false,
    },
    {
      icon: Newspaper,
      label: `${currentLanguage.analytics_overviewPostAnalytics_title}`,
      href: "/admin/analytics/posts",
      isNew: false,
      somethingImportant: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {analyticsCards.map((route) => (
        <MenuItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          isNew={route.isNew}
          somethingImportant={route.somethingImportant}
          themeColor={container?.ThemeColor!}
          darkThemeColor={container?.DarkThemeColor!}
        />
      ))}
    </div>
  );
};
