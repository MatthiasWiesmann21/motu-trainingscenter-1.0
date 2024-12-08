"use client";

import {
  ImageIcon,
  PaletteIcon,
  Settings,
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
      isNew: false,
      somethingImportant: false,
    },
    {
      icon: PaletteIcon,
      label: `${currentLanguage.settings_menu_design_title}`,
      href: "/admin/settings/buttondesign",
      isNew: false,
      somethingImportant: false,
    },
    {
      icon: PaletteIcon,
      label: `${currentLanguage.settings_menu_navigationdesign_title}`,
      href: "/admin/settings/navigationdesign",
      isNew: false,
      somethingImportant: false,
    },
    {
      icon: PaletteIcon,
      label: `${currentLanguage.settings_menu_themedesign_title}`,
      href: "/admin/settings/themedesign",
      isNew: false,
      somethingImportant: false,
    },
    {
      icon: ImageIcon,
      label: `${currentLanguage.settings_menu_authenticationdesign_title}`,
      href: "/admin/settings/authenticationdesign",
      isNew: false,
      somethingImportant: false,
    },
  ];

  const routes = MenuRoutesList;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {routes.map((route) => (
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
