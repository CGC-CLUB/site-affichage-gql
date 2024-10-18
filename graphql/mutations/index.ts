import type {
  CreateDepartmentInput,
  CreatePostInput,
  CreateTVInput,
  CreateUserInput,
  LoginInput,
  LoginTvInput,
  ValidatePostInput,
  ValidateUserInput,
} from "@/types";
import jwt from "jsonwebtoken";
import useUser from "@/utils/useUser";
import { GraphQLError } from "graphql";
import { Department, Post, TVs, User } from "@/prisma/drizzle/schema";
import { db } from "@/prisma/db";
import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export async function login({ input, req }: { input: LoginInput; req: Request }) {
  const user = (
    await db
      .select()
      .from(User)
      .where(and(eq(User.email, input.email), eq(User.password, input.password)))
  ).at(0);

  if (!user) {
    return new GraphQLError("User not found");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
  req.cookieStore?.set("token", token);
  return user;
}

export async function createUser({ input, req }: { input: CreateUserInput; req: Request }) {
  const user = await useUser(req);
  if (!user) {
    return new GraphQLError("User not found");
  }

  if (user.role === "USER") {
    return new GraphQLError("You can't create a user with this role");
  }
  const newUser = await db
    .insert(User)
    .values({
      id: uuid(),
      email: input.email,
      first_name: input.first_name,
      family_name: input.family_name,
      password: input.password,
      role: input.role,
      validated: false,
    })
    .returning();
  console.log(newUser);
  return newUser.at(0);
}

export async function createPost({ req, input }: { input: CreatePostInput; req: Request }) {
  const user = await useUser(req);
  if (!user) {
    return new GraphQLError("User not found");
  }

  const validated = user.role !== "USER";
  const important = user.role === "ADMIN";

  const newPost = await db
    .insert(Post)
    .values({
      id: uuid(),
      content: input.content,
      image: input.image,
      authorId: user.id,
      departmentId: input.departmentId,
      validated,
      important,
    })
    .returning();
  return newPost.at(0);
}

export async function createDepartment({ input, req }: { input: CreateDepartmentInput; req: Request }) {
  const user = await useUser(req);
  if (!user) {
    return new GraphQLError("User not found");
  }
  if (user.role !== "ADMIN") {
    return new GraphQLError("You can't create a department with this role");
  }
  const newDepartment = await db
    .insert(Department)
    .values({
      id: uuid(),
      name: input.name,
      chefId: input.chef,
    })
    .returning();
  return newDepartment.at(0);
}

export async function createTV({ input, req }: { input: CreateTVInput; req: Request }) {
  const user = await useUser(req);
  if (!user) {
    return new GraphQLError("User not found");
  }
  if (user.role !== "ADMIN") {
    return new GraphQLError("You can't create a TV with this role");
  }

  const newTV = await db
    .insert(TVs)
    .values({
      id: uuid(),
      name: input.name,
      password: input.password,
      departmentId: input.department,
    })
    .returning();
  return newTV.at(0);
}

export async function validateUser({ input, req }: { input: ValidateUserInput; req: Request }) {
  const user = await useUser(req);
  if (!user) {
    return new GraphQLError("User not found");
  }
  if (user.role === "USER") {
    return new GraphQLError("You can't validate a user with this role");
  }
  const userToUpdate = await db.select().from(User).where(eq(User.id, input.id));
  if (userToUpdate.length === 0) {
    return new GraphQLError("User not found");
  }
  const updatedUser = await db.update(User).set({ validated: true }).where(eq(User.id, input.id)).returning();
  return updatedUser.at(0);
}

export async function validatePost({ input, req }: { input: ValidatePostInput; req: Request }) {
  const user = await useUser(req);
  if (!user) {
    return new GraphQLError("User not found");
  }
  if (user.role === "USER") {
    return new GraphQLError("You can't validate a post with this role");
  }

  const postToUpdate = await db.select().from(Post).where(eq(Post.id, input.id));
  if (postToUpdate.length === 0) {
    return new GraphQLError("Post not found");
  }
  const updatedPost = await db.update(Post).set({ validated: true }).where(eq(Post.id, input.id)).returning();
  return updatedPost.at(0);
}

export async function loginTv({ input, req }: { input: LoginTvInput; req: Request }) {
  // const tv = await prisma.tVs.findMany();
  // const t = tv.find((t) => t.name === input.name && t.password === input.password);
  // if (!t) {
  //   return new GraphQLError("TV not found");
  // }
  const tv = (
    await db
      .select()
      .from(TVs)
      .where(and(eq(TVs.name, input.name), eq(TVs.password, input.password)))
  ).at(0);
  if (!tv) {
    return new GraphQLError("TV not found");
  }
  req.cookieStore?.set("tv-token", jwt.sign({ tvId: tv?.id }, process.env.JWT_SECRET as string));
  return tv;
}

export async function logout({ req }: { req: Request }) {
  await req.cookieStore?.delete("token");
  return "ok";
}

export async function invalidatePost({ input, req }: { input: ValidatePostInput; req: Request }) {
  const user = await useUser(req);
  if (!user) {
    return new GraphQLError("User not found");
  }
  const post = (await db.select().from(Post).where(eq(Post.id, input.id))).at(0);
  if (!post) {
    return new GraphQLError("Post Not Found");
  }
  if (user.id === post.authorId) {
    const postToUpdate = await db.select().from(Post).where(eq(Post.id, input.id));
    if (postToUpdate.length === 0) {
      return new GraphQLError("Post not found");
    }
    const updatedPost = await db.update(Post).set({ validated: false }).where(eq(Post.id, input.id)).returning();
    return updatedPost.at(0);
  } else {
    return new GraphQLError("You can't invalidate a post with this role");
  }
}

export async function invalidateUser({ input, req }: { input: ValidateUserInput; req: Request }) {
  const user = await useUser(req);
  if (!user) {
    return new GraphQLError("User not found");
  }
  if (user.role === "USER") {
    return new GraphQLError("You can't invalidate a user with this role");
  }
  const userToUpdate = await db.select().from(User).where(eq(User.id, input.id));
  if (userToUpdate.length === 0) {
    return new GraphQLError("User not found");
  }
  const updatedUser = await db.update(User).set({ validated: false }).where(eq(User.id, input.id)).returning();
  return updatedUser.at(0);
}
