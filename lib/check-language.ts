"use client";

import {
  Deutch,
  English,
  Espanol,
  Francaise,
  Italiano,
  Portugues,
  Mandarin,
  Russian,
} from "../lib/localization";

import { useSelector } from "react-redux";

export const useLanguage = () => {
  const selectedLanguage = useSelector((state: any) => state.language);
  const currentLanguage = selectedLanguage;
  switch (currentLanguage) {
    case 'English':
      return English;

    case 'Deutsch':
      return Deutch;

    case 'Francaise':
      return Francaise;

    case 'Italiano':
      return Italiano;

    case 'Espanol':
      return Espanol;

    case 'Portugues':
      return Portugues;

    case 'Russian':
      return Russian;

    case 'Mandarin':
      return Mandarin;

    default:
      return English;
  }
};
