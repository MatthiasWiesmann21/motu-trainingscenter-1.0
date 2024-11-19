import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
  containerId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        favorites: true,
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          include: {
            userProgress: true,
            likes: true,
            comments: {
              include: {
                likes: true,
                subComment: {
                  include: {
                    likes: true,
                    profile: true,
                  },
                },
                profile: true,
              },
              where: {
                parentComment: null,
              },
            },
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }

          const progressPercentage = await getProgress(userId, course.id);

          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );

    const profile = await db?.profile?.findFirst({
      select: {
        id: true,
      },
      where: {
        userId: userId,
      },
    });

    const result = coursesWithProgress?.map((each: any) => {
      const currentFavorite = each?.favorites?.some(
        (favorite: any) => favorite?.profileId === profile?.id
      );
      return { ...each, currentFavorite };
    });

    return result;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
