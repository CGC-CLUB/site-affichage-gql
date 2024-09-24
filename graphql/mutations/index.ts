import { CreateDepartmentInput, CreatePostInput, CreateTVInput, CreateUserInput, LoginInput } from "../../types";
import prisma from "../../utils/prisma";
import jwt from "jsonwebtoken";
import useUser from "../../utils/useUser";
import { GraphQLError } from "graphql";

export async function login({ input, req }: { input: LoginInput; req: Request }) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
      password: input.password,
    },
  });

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

  if (user.role === "ADMIN" || user.role === "CHEF") {
    return new GraphQLError("You can't create a user with this role");
  }
  return await prisma.user.create({
    data: {
      email: input.email,
      first_name: input.first_name,
      family_name: input.family_name,
      password: input.password,
      role: input.role,
    },
  });
}

export async function createPost({ req, input }: { input: CreatePostInput; req: Request }) {
  const user = await useUser(req);
  if (!user) {
    return new GraphQLError("User not found");
  }

  return prisma.post.create({
    data: {
      content: input.content,
      image: input.image,
      authorId: user.id,
    },
  });
}

export async function createDepartment({ input, req }: { input: CreateDepartmentInput; req: Request }) {
  const user = await useUser(req);
  if (!user) {
    return new GraphQLError("User not found");
  }
  if (user.role !== "ADMIN") {
    return new GraphQLError("You can't create a department with this role");
  }
  return prisma.department.create({
    data: {
      name: input.name,
      chefId: input.chef,
    },
  });
}

export async function createTV({ input, req }: { input: CreateTVInput; req: Request }) {
  const user = await useUser(req);
  if (!user) {
    return new GraphQLError("User not found");
  }
  if (user.role !== "ADMIN") {
    return new GraphQLError("You can't create a TV with this role");
  }
  return prisma.tVs.create({
    data: {
      name: input.name,
      password: input.password,
      departmentId: input.department,
    },
  });
}
