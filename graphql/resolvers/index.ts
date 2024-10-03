import { PostFilterInput, UserFilterInput } from "@/types";
import prisma from "@/utils/prisma";
import Filter from "@/utils/filter";
import useUser from "@/utils/useUser";
import { GraphQLError } from "graphql";

export function getUsers(filter?: UserFilterInput) {
  const where = Filter<UserFilterInput>(filter);
  return prisma.user.findMany({
    where,
  });
}

export function getUser(id: string) {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
  });
}

export function getPosts(filter?: PostFilterInput) {
  const where = Filter<PostFilterInput>(filter);
  return prisma.post.findMany({
    where,
  });
}

export async function getPost(id: string) {
  console.log(id);
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  console.log(post);
  return post;
}

export function getDepartments() {
  return prisma.department.findMany({});
}

export function getDepartment(id: string) {
  return prisma.department.findUnique({
    where: {
      id: id,
    },
  });
}

export function getTVs() {
  return prisma.tVs.findMany({});
}

export function getTV(id: string) {
  return prisma.tVs.findUnique({
    where: {
      id: id,
    },
  });
}

export async function me(req: Request) {
  const user = await useUser(req);
  const token = await req.cookieStore?.get("token");
  if (!user) {
    return new GraphQLError("You must be logged in to access this field");
  }
  console.log(user);
  return user;
}
