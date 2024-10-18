import { PostFilterInput, UserFilterInput } from "@/types";
import prisma from "@/utils/prisma";
import Filter from "@/utils/filter";
import useUser from "@/utils/useUser";
import { GraphQLError } from "graphql";
import { Department, Post, TVs, User } from "@/prisma/drizzle/schema";
import { and, eq, type SQL } from "drizzle-orm";
import { Role } from "@prisma/client";

export function getUsers(filter?: UserFilterInput) {
  const filters: SQL[] = [];
  if (filter?.email) filters.push(eq(User.email, filter.email));
  if (filter?.first_name) filters.push(eq(User.first_name, filter.first_name));
  if (filter?.family_name) filters.push(eq(User.family_name, filter.family_name));
  if (filter?.validated) filters.push(eq(User.validated, filter.validated));
  if (filter?.role) filters.push(eq(User.role, filter.role));
  if (filter?.id) filters.push(eq(User.id, filter.id));

  return prisma.$drizzle
    .select()
    .from(User)
    .where(and(...filters));
}

export function getUser(id: string) {
  return prisma.$drizzle.select().from(User).where(eq(User.id, id));
}

export async function getPosts(filter?: PostFilterInput) {
  const filters: SQL[] = [];
  if (filter?.id) filters.push(eq(Post.id, filter.id));
  if (filter?.validated) filters.push(eq(Post.validated, filter.validated));
  if (filter?.content) filters.push(eq(Post.content, filter.content));
  if (filter?.departmentId) filters.push(eq(Post.departmentId, filter.departmentId));
  if (filter?.authorId) filters.push(eq(Post.authorId, filter.authorId));
  const primaryPosts = await prisma.$drizzle
    .select()
    .from(Post)
    .where(and(...filters));
  const adminPosts = await prisma.$drizzle.select().from(Post).where(eq(Post.important, true));
  return [...adminPosts, ...primaryPosts];
}

export async function getPost(id: string) {
  return prisma.$drizzle.select().from(Post).where(eq(Post.id, id));
}

export function getDepartments() {
  return prisma.$drizzle.select().from(Department);
}

export async function getDepartment(id: string) {
  const department = await prisma.$drizzle.select().from(Department).where(eq(Department.id, id));
  console.log(department);
  return department;
}

export function getTVs() {
  return prisma.$drizzle.select().from(TVs);
}

export function getTV(id: string) {
  return prisma.$drizzle.select().from(TVs).where(eq(TVs.id, id));
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
