"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isOwner } from "@/lib/owner";

import { SearchInput } from "./search-input";
import { ModeToggle } from "./mode-toggle";
import { LanguageToggle } from "./language-toggle";
import { useIsAdmin, useIsOperator } from "@/lib/roleCheck";
import { useLanguage } from "@/lib/check-language";
import ProfileButton from "./profile-button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

interface NavbarRoutesProps {
  profileId: string;
  profileName: string;
  profileImageUrl: string;
  profileOnlineStatus: string;
  profileRole: string;
}

export const NavbarRoutes = ({
  profileId,
  profileName,
  profileImageUrl,
  profileOnlineStatus,
  profileRole,
}: NavbarRoutesProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const currentLanguage = useLanguage();

  const isAdmin = useIsAdmin();
  const isOperator = useIsOperator();
  const isClientAdmin = profileRole === "CLIENT ADMIN";

  const userId = session?.user?.id;
  const canAccess = isAdmin || isOperator || isClientAdmin || isOwner(userId);

  const isAdministrationPage = pathname?.startsWith("/admin");
  const isCoursePage = pathname?.includes("/courses");
  const isCourseListPage = pathname === "/dashboard/course-list";
  const isSearchPage = pathname === "/search";
  const isLiveEventPage = pathname === "/live-event";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      {isCourseListPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      {isLiveEventPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="ml-auto flex gap-x-1">
        <TooltipProvider>
          <>
            <LanguageToggle profileId={profileId} />
            <Tooltip>
              <TooltipTrigger>
                <ModeToggle />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {currentLanguage.navigation_mode_tooltip}
              </TooltipContent>
            </Tooltip>
            {isAdministrationPage || isCoursePage ? (
              <Link href="/dashboard">
                <Button size="default" variant="ghost">
                  <LogOut className="h-5 w-5" />
                  {currentLanguage.navigation_administration_button_text_exit}
                </Button>
              </Link>
            ) : canAccess ? (
              <Tooltip>
                <TooltipTrigger>
                  <Link href="/admin/courses">
                    <Button size="default" variant="ghost">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {currentLanguage.navigation_administration_tooltip}
                </TooltipContent>
              </Tooltip>
            ) : null}
            <div className="m-2 flex items-center justify-center">
              <ProfileButton
                profileId={profileId}
                profileName={profileName}
                profileImageUrl={profileImageUrl}
                profileOnlineStatus={profileOnlineStatus}
                profileRole={profileRole}
              />
            </div>
          </>
        </TooltipProvider>
      </div>
    </>
  );
};
