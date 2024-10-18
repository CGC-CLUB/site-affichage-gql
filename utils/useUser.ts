import { db } from "@/prisma/db";
import parseToken from "./parse-token";
import { User } from "@/prisma/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function useUser(req: Request) {
  const token = await req.cookieStore?.get("token");
  if (!token) {
    return null;
  }
  const decoded = parseToken(token.value);
  if (!decoded) {
    return null;
  }

  const user = (await db.select().from(User).where(eq(User.id, decoded.userId))).at(0);
  return user;
}
