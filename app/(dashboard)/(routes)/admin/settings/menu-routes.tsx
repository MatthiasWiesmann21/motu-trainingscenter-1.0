"use client";

import {
  BarChartIcon,
  ClapperboardIcon,
  Compass,
  FolderOpen,
  Globe2,
  Layout,
  LayoutDashboard,
  LayoutGridIcon,
  ListIcon,
  Mail,
  MailIcon,
  MessageCircle,
  NewspaperIcon,
  PaletteIcon,
  PinIcon,
  Server,
  ServerIcon,
  Settings,
  UserCircle2Icon,
  Video,
} from "lucide-react";

import { MenuItem } from "./menu-item";
import { useLanguage } from "@/lib/check-language";
import { Container } from "@prisma/client";


interface SettingsMenuItemProps {
  container: Container
}

export const MenuRoutes = ({
  container,
}: SettingsMenuItemProps) => {
  const currentLanguage = useLanguage();

  const MenuRoutesList = [
    {
      icon: Settings,
      label: `${currentLanguage.settings_menu_containersettings_title}`,
      href: "/admin/settings/containersetting",
      isNew: true,
      somethingImportant: true,
    },
    {
      icon: PaletteIcon,
      label: `${currentLanguage.settings_menu_design_title}`,
      href: "/admin/settings/buttondesign",
      isNew: true,
      somethingImportant: true,
    },
    {
      icon: PaletteIcon,
      label: `${currentLanguage.settings_menu_navigationdesign_title}`,
      href: "/admin/settings/navigationdesign",
      isNew: true,
      somethingImportant: true,
    },
    {
      icon: PaletteIcon,
      label: `${currentLanguage.settings_menu_themedesign_title}`,
      href: "/admin/settings/themedesign",
      isNew: true,
      somethingImportant: true,
    },
  ];

  const routes = MenuRoutesList;

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {routes.map((route) => (
        <MenuItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          isNew={route.isNew}
          somethingImportant={route.somethingImportant}
          ThemeOutlineColor={container?.ThemeOutlineColor!}
          DarkThemeOutlineColor={container?.DarkThemeOutlineColor!}
        />
      ))}
    </div>
  );
};
