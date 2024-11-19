import { db } from "@/lib/db";


type GetCategories = {
  name?: string;
  categoryId?: string;
};

export const getCategories = async ({
  name,
  categoryId
}: GetCategories) => {
  try {
    const category = await db.category.findMany({
      where: {
        isPublished: true,
        name: {
          contains: name,
        },
        id: categoryId,
      }
    });

   

    return category;
  } catch (error) {
    console.log("[GET_POSTS]", error);
    return [];
  }
}