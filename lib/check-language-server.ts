import {
  Deutch,
  English,
  Espanol,
  Francaise,
  Italiano,
  Portugues,
  Mandarin,
  Russian,
} from "./localization";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

const getUser = async () => {
  try {
      const { userId } = auth();
      if (!userId) return;
      const user = await db?.profile?.findFirst({
        where: { userId: userId },
        include: {
          container: true,
        },
      });
      if (!user) {
        return;
      }
      return user.language;
    } catch (error) {
      return;
    }
};


export const languageServer = async () => {
  //@ts-ignore
  const getUserLanguage = await getUser();
  const currentLanguage = getUserLanguage;
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
