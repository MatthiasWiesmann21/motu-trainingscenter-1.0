import NextAuth, { SessionStrategy } from "next-auth";
import { PrismaClient } from "@prisma/client";
import authOptions from "@/lib/auth";

 const handlers = NextAuth(authOptions);
// export const { GET, POST } = handlers
export { handlers as GET, handlers as POST };
