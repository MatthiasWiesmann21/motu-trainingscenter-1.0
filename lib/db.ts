import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = new PrismaClient();
  //   {
  //   log: ["query", "info", "warn", "error"],
  // }

  // @ts-ignore
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
