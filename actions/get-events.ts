import { Category, Course, LiveEvent } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type EventWithProgressWithCategory = LiveEvent & {
  category: Category | null;
};

type GetEvents = {
  userId: string;
  title?: string;
  categoryId?: string;
  containerId?: string;
};

export const getEvents = async ({
  userId,
  title,
  categoryId,
}: GetEvents): Promise<EventWithProgressWithCategory[]> => {
  try {
    const liveEvent = await db.liveEvent.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const eventsWithProgress: EventWithProgressWithCategory[] =
      await Promise.all(
        liveEvent.map(async (liveEvent) => {
          if (liveEvent.isPublished === true) {
            return {
              ...liveEvent,
            };
          }
          return {
            ...liveEvent,
          };
        })
      );

    return eventsWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
