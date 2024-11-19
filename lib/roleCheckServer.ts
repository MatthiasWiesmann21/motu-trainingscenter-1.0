import { db } from "@/lib/db";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
const getUser = async () => {
    try {
        // Get the session object from NextAuth
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return; // Access user ID from session
        const user = await db?.profile?.findFirst({
            where: { userId: session.user.id },
            include: {
                container: true,
            },
        });
        if (!user) {
            return;
        }
        return user.role;
    } catch (error) {
        console.error(error); // Log errors for debugging
        return;
    }
};

export const isClientAdmin = async () => {
    const getUserRole = await getUser();
    return getUserRole === "CLIENT ADMIN";
};

export const isAdmin = async () => {
    const getUserRole = await getUser();
    return getUserRole === "ADMIN";
};

export const isOperator = async () => {
    const getUserRole = await getUser();
    return getUserRole === "OPERATOR";
};

export const isModerator = async () => {
    const getUserRole = await getUser();
    return getUserRole === "MODERATOR";
};

export const isUser = async () => {
    const getUserRole = await getUser();
    return getUserRole === "USER";
};
