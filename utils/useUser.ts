import parseToken from "./parse-token";
import prisma from "./prisma";

export default async function useUser(req: Request) {
  const token = await req.cookieStore?.get("token");
  if (!token) {
    return null;
  }
  const decoded = parseToken(token.value);
  if (!decoded) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });
  return user;
}
