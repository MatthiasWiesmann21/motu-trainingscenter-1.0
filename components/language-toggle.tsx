"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import AppSVGIcon from "./appsvgicon";
import { useLanguage } from "@/lib/check-language";
import axios from "axios";
import { useRouter } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";

interface LanguageToggleProps {
  profileId: string
}

export function LanguageToggle({profileId} : LanguageToggleProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const language = useSelector((state: any) => state?.language);
  const currentLanguage = useLanguage();
  // const [language, setLanguage] = React.useState("English");

  const onSubmit = async (values: string) => {
    try {
      await axios.patch(`/api/profile/${profileId}`, { language: values });
      router?.refresh();
    } catch {
      console.log("Something went wrong");
    }
  };


  const setLanguage = (language: string) => {
    dispatch({ type: "SetLanguage", payload: language });
    onSubmit(language);
  };

  const icon: any = {
    English: "gb",
    Deutsch: "de",
    Francaise: "fr",
    Italiano: "it",
    Espanol: "es",
    Portugues: "pt",
    Russian: "ru",
    Mandarin: "tw",
  };

  console.log("Current language:", language);
  console.log("Icon for current language:", icon[language]);


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="ml-2 h-10 w-14 rounded-md hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] bg-transparent flex items-center justify-center">
          <AppSVGIcon customclass="" icon={icon[language]} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("English")}>
          <AppSVGIcon customclass="mr-1" icon={"gb"} />
          {currentLanguage.navigation_language_toggle_english}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("Deutsch")}>
          <AppSVGIcon customclass="mr-1" icon={"de"} />
          {currentLanguage.navigation_language_toggle_german}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("Francaise")}>
          <AppSVGIcon customclass="mr-1" icon={"fr"} />
          {currentLanguage.navigation_language_toggle_french}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("Italiano")}>
          <AppSVGIcon customclass="mr-1" icon={"it"} />
          {currentLanguage.navigation_language_toggle_italian}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("Espanol")}>
          <AppSVGIcon customclass="mr-1" icon={"es"} />
          {currentLanguage.navigation_language_toggle_spanish}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("Portugues")}>
          <AppSVGIcon customclass="mr-1" icon={"pt"} />
          {currentLanguage.navigation_language_toggle_portuguese}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("Russian")}>
          <AppSVGIcon customclass="mr-1" icon={"ru"} />
          {currentLanguage.navigation_language_toggle_russian}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("Mandarin")}>
          <AppSVGIcon customclass="mr-1" icon={"tw"} />
          {currentLanguage.navigation_language_toggle_mandarin}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
