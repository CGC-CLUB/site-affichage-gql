import { PostFilterInput, UserFilterInput } from "@/types";
import useUser from "@/utils/useUser";
import { GraphQLError } from "graphql";
import { Department, Post, TVs, User } from "@/prisma/drizzle/schema";
import { and, eq, sql, type SQL, gte } from "drizzle-orm";
import { db } from "@/prisma/db";

export function getUsers(filter?: UserFilterInput) {
  try {
    const filters: SQL[] = [];
    if (filter?.email) filters.push(eq(User.email, filter.email));
    if (filter?.first_name) filters.push(eq(User.first_name, filter.first_name));
    if (filter?.family_name) filters.push(eq(User.family_name, filter.family_name));
    if (filter?.validated) filters.push(eq(User.validated, filter.validated));
    if (filter?.role) filters.push(eq(User.role, filter.role));
    if (filter?.id) filters.push(eq(User.id, filter.id));

    return db
      .select()
      .from(User)
      .where(and(...filters));
  } catch (error) {
    if (error instanceof Error) return new GraphQLError(error.message);
    return new GraphQLError("An error occurred");
  }
}

export function getUser(id: string) {
  try {
    return db.select().from(User).where(eq(User.id, id));
  } catch (error) {
    if (error instanceof Error) return new GraphQLError(error.message);
    return new GraphQLError("An error occurred");
  }
}

export async function getPosts(filter?: PostFilterInput) {
  try {
    const filters: SQL[] = [];
    const sevenDaysAgo = sql`NOW() - INTERVAL '7 days'`;
    if (filter?.id) filters.push(eq(Post.id, filter.id));
    if (filter?.validated) filters.push(eq(Post.validated, filter.validated));
    if (filter?.content) filters.push(eq(Post.content, filter.content));
    if (filter?.departmentId) filters.push(eq(Post.departmentId, filter.departmentId));
    if (filter?.authorId) filters.push(eq(Post.authorId, filter.authorId));

    const primaryPosts = await db
      .select()
      .from(Post)
      .where(and(...filters, eq(Post.important, false), gte(Post.createdAt, sevenDaysAgo)));

    const adminPosts = await db
      .select()
      .from(Post)
      .where(and(eq(Post.important, true), gte(Post.createdAt, sevenDaysAgo)));
    console.log([...adminPosts, ...primaryPosts]);
    return [...adminPosts, ...primaryPosts];
  } catch (error) {
    if (error instanceof Error) return new GraphQLError(error.message);
    return new GraphQLError("An error occurred");
  }
}

export async function getPost(id: string) {
  try {
    return db.select().from(Post).where(eq(Post.id, id));
  } catch (error) {
    if (error instanceof Error) return new GraphQLError(error.message);
    return new GraphQLError("An error occurred");
  }
}

export function getDepartments() {
  try {
    return db.select().from(Department);
  } catch (error) {
    if (error instanceof Error) return new GraphQLError(error.message);
    return new GraphQLError("An error occurred");
  }
}

export async function getDepartment(id: string) {
  try {
    const department = await db.select().from(Department).where(eq(Department.id, id));
    console.log(department);
    return department;
  } catch (error) {
    if (error instanceof Error) return new GraphQLError(error.message);
    return new GraphQLError("An error occurred");
  }
}

export function getTVs() {
  try {
    return db.select().from(TVs);
  } catch (error) {
    if (error instanceof Error) return new GraphQLError(error.message);
    return new GraphQLError("An error occurred");
  }
}

export function getTV(id: string) {
  try {
    return db.select().from(TVs).where(eq(TVs.id, id));
  } catch (error) {
    if (error instanceof Error) return new GraphQLError(error.message);
    return new GraphQLError("An error occurred");
  }
}

export async function me(req: Request) {
  try {
    const user = await useUser(req);
    const token = await req.cookieStore?.get("token");
    if (!user) {
      return new GraphQLError("You must be logged in to access this field");
    }
    console.log(user);
    return user;
  } catch (error) {
    if (error instanceof Error) return new GraphQLError(error.message);
    return new GraphQLError("An error occurred");
  }
}
