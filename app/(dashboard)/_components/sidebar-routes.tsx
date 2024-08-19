"use client";

import {
  BarChartIcon,
  BookMarked,
  CalendarCheck2,
  ClapperboardIcon,
  Compass,
  FolderOpen,
  Globe2,
  Layout,
  LayoutGridIcon,
  ListIcon,
  MessageCircle,
  NewspaperIcon,
  Settings,
  UserCircle,
  UserCircle2Icon,
  Video,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";
import { useSelector } from "react-redux";
import { useLanguage } from "@/lib/check-language";

interface NavColor {
  navPrimaryColor: string; // The color code, e.g., "#FFFFFF"
  navBackgroundColor: string;
  navDarkPrimaryColor: string;
  navDarkBackgroundColor: string;
}

export const SidebarRoutes = ({
  navPrimaryColor,
  navBackgroundColor,
  navDarkPrimaryColor,
  navDarkBackgroundColor,
}: NavColor) => {
  const currentLanguage = useLanguage();

  const userRoutes = [
    {
      icon: Compass,
      label: `${currentLanguage.nav_item_browse}`,
      href: "/search",
      isNew: false,
    },
    {
      icon: Layout,
      label: `${currentLanguage.nav_item_dashboard}`,
      href: "/dashboard",
      isNew: false,
    },
    {
      icon: Globe2,
      label: `${currentLanguage.nav_item_news}`,
      href: "/news",
      isNew: false,
    },
    {
      icon: Video,
      label: `${currentLanguage.nav_item_liveEvent}`,
      href: "/live-event",
      isNew: false,
    },
    {
      icon: MessageCircle,
      label: `${currentLanguage.nav_item_chat}`,
      href: "/chat",
      isNew: false,
    },
    {
      icon: FolderOpen,
      label: `${currentLanguage.nav_item_documents}`,
      href: "/documents",
      isNew: false,
    },
    {
      icon: UserCircle,
      label: `${currentLanguage.nav_item_career}`,
      href: "/career",
      isNew: false,
    },
    {
      icon: CalendarCheck2,
      label: `${currentLanguage.nav_item_calendar}`,
      href: "/calendar",
      isNew: false,
    },
    {
      icon: BookMarked,
      label: `${currentLanguage.nav_item_knowledgeHub}`,
      href: "/knowledge-hub",
      isNew: false,
    },
  ];
  
  const packageStarterRoutes = [
    {
      icon: Compass,
      label: `${currentLanguage.nav_item_browse}`,
      href: "/search",
      isNew: false,
    },
    {
      icon: Layout,
      label: `${currentLanguage.nav_item_Dashboard}`,
      href: "/dashboard",
      isNew: false,
    },
    {
      icon: Globe2,
      label: `${currentLanguage.nav_item_news}`,
      href: "/news",
      isNew: false,
    },
  ];
  
  const AdministrationRoutes = [
    {
      icon: ListIcon,
      label: `${currentLanguage.nav_admin_item_course}`,
      href: "/admin/courses",
      isNew: false,
    },
    {
      icon: NewspaperIcon,
      label: `${currentLanguage.nav_admin_item_posts}`,
      href: "/admin/posts",
      isNew: false,
    },
    {
      icon: ClapperboardIcon,
      label: `${currentLanguage.nav_admin_item_liveEvents}`,
      href: "/admin/live-event",
      isNew: false,
    },
    {
      icon: LayoutGridIcon,
      label: `${currentLanguage.nav_admin_item_categories}`,
      href: "/admin/categories",
      isNew: false,
    },
    {
      icon: UserCircle2Icon,
      label: `${currentLanguage.nav_admin_item_users}`,
      href: "/admin/users",
      isNew: false,
    },
    {
      icon: BarChartIcon,
      label: `${currentLanguage.nav_admin_item_analytics}`,
      href: "/admin/analytics",
      isNew: false,
    },
    {
      icon: Settings,
      label: `${currentLanguage.nav_admin_item_settings}`,
      href: "/admin/settings",
      isNew: false,
    },
  ];

  const client = useSelector((state: any) => state?.user);

  const pathname = usePathname();

  const isAdministrationPage = pathname?.includes("/admin");

  const routes = isAdministrationPage
    ? AdministrationRoutes
    : client?.container?.clientPackage === "STARTER"
    ? packageStarterRoutes
    : userRoutes;

  return (
    <div className="flex w-full flex-col">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          isNew={route.isNew}
          navPrimaryColor={navPrimaryColor}
          navBackgroundColor={navBackgroundColor}
          navDarkBackgroundColor={navDarkBackgroundColor}
          navDarkPrimaryColor={navDarkPrimaryColor}
        />
      ))}
    </div>
  );
};
