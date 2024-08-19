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

export function LanguageToggle() {
  const router = useRouter();
  const dispatch = useDispatch();
  const language = useSelector((state: any) => state?.language);
  const user = useSelector((state: any) => state?.user);

  const currentLanguage = useLanguage();

  // const [language, setLanguage] = React.useState("English");

  const onSubmit = async (values: string) => {
    try {
      await axios.patch(`/api/profile/${user.id}`, { language: values });
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="ml-2 border-0 bg-transparent" variant="outline">
          <AppSVGIcon customclass="mr-1" icon={icon[language]} />
          {/* <Globe className="tran h-[1.2rem] w-[1.2rem] rotate-0 scale-100" /> */}
          <span className="sr-only">Toggle theme</span>
        </Button>
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
