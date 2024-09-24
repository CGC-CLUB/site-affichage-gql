import jwt from "jsonwebtoken";

export default function parseToken(token: string) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
  return decoded;
}
