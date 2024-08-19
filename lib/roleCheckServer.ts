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
        return user.role;
      } catch (error) {
        return;
      }
  };

export const isAdmin = async() => {
    const getUserRole = await getUser();
    return getUserRole === "ADMIN";
};

export const isOperator = async() => {
    const getUserRole = await getUser();
    return getUserRole === "OPERATOR";
};

export const isModerator = async() => {
    const getUserRole = await getUser();
    return getUserRole === "MODERATOR";
};

export const isUser = async() => {
    const getUserRole = await getUser();
    return getUserRole === "USER";
};

