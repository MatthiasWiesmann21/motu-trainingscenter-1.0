import { db } from "@/lib/db";

type GetChapter = {
  userId: string;
};

export const getAllChapters = async ({ userId }: GetChapter) => {
  try {
    const chapter = await db.chapter.findMany({
      include: {
        favorites: true,
        course: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const profile = await db?.profile?.findFirst({
      select: {
        id: true,
      },
      where: {
        userId: userId,
      },
    });

    const result = chapter?.map((each: any) => {
      const currentFavorite = each?.favorites?.some(
        (favorite: any) => favorite?.profileId === profile?.id
      );

      return { ...each, currentFavorite };
    });

    return result;
  } catch (error) {
    console.log("[GET_CHAPTERS]", error);
    return [];
  }
};
