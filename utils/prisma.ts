import { PrismaClient } from "@prisma/client";
import { drizzle } from 'drizzle-orm/prisma/pg';

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(drizzle());
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
