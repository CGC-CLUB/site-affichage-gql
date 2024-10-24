import { Elysia } from "elysia";
import { yoga } from "@elysiajs/graphql-yoga";
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import * as resolvers from "@/graphql/resolvers";
import * as mutations from "@/graphql/mutations";
import { CreatePostInput, CreateUserInput, PostFilterInput, UserFilterInput } from "@/types";
import { Department as DepartmentType, type Post as PostType, type User as UserType } from "@prisma/client";
import { cors } from "@elysiajs/cors";
import { schema } from "./graphql/schema";
import prisma from "./utils/prisma";
import { db } from "./prisma/db";
import { Department, Post, TVs, User } from "./prisma/drizzle/schema";
import { eq } from "drizzle-orm";

const app = new Elysia()
  .use(cors())
  .use(
    yoga({
      typeDefs: schema,
      context: {
        name: "Mobius",
      },
      useContext(_) {},
      resolvers: {
        Query: {
          users: (_, args) => resolvers.getUsers(args?.filter as UserFilterInput),
          user: (_, args) => resolvers.getUser(args.id),
          posts: (_, args) => resolvers.getPosts(args?.filter as PostFilterInput),
          post: (_, args) => resolvers.getPost(args.id),
          departments: () => resolvers.getDepartments(),
          department: (_, args) => resolvers.getDepartment(args.id),
          TVs: () => resolvers.getTVs(),
          TV: (_, args) => resolvers.getTV(args.id),
          me: (_, _args, ctx) => {
            const req = ctx.request;
            return resolvers.me(req) as Promise<UserType>;
          },
        },
        Mutation: {
          login: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.login({ input: args.input, req }) as Promise<UserType>;
          },
          createUser: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.createUser({ input: args.input as CreateUserInput, req }) as Promise<UserType>;
          },
          createDepartment: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.createDepartment({ input: args.input, req }) as Promise<DepartmentType>;
          },
          createTV: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.createTV({ input: args.input, req });
          },
          createPost: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.createPost({ input: args.input as CreatePostInput, req }) as Promise<PostType>;
          },
          validateUser: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.validateUser({ input: args.input, req }) as Promise<UserType>;
          },
          validatePost: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.validatePost({ input: args.input, req }) as Promise<PostType>;
          },
          loginTv(_parent, args, ctx) {
            const req = ctx.request;
            return mutations.loginTv({ input: args.input, req });
          },
          invalidatePost: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.invalidatePost({ input: args.input, req }) as Promise<PostType>;
          },
          invalidateUser: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.invalidateUser({ input: args.input, req }) as Promise<UserType>;
          },
          logout: (_, _args, ctx) => {
            const req = ctx.request;
            return mutations.logout({ req });
          },
        },
        Department: {
          /*
           * why i'm i getting this error:
           * cuz the return type of the resolver is a promise + the type are not the same exactly (prisma got additional fields)
           * so i'm just ignoring them
           */
          // @ts-ignore
          chef: async (parent) => (await db.select().from(User).where(eq(User.id, parent.chefId))).at(0),
          // @ts-ignore
          TVs: async (parent) => await db.select().from(TVs).where(eq(TVs.departmentId, parent.id)),
          // @ts-ignore
          posts: async (parent) => await db.select().from(Post).where(eq(Post.departmentId, parent.id)),
        },
        User: {
          // @ts-ignore
          posts: (parent) => db.select().from(Post).where(eq(Post.authorId, parent.id)),
          // @ts-ignore
          department: async (parent) => (await db.select().from(Department).where(eq(Department.id, parent.departmentId))).at(0),
        },
        Post: {
          // @ts-ignore
          author: async (parent) => (await db.select().from(User).where(eq(User.id, parent.authorId))).at(0),
          // @ts-ignore
          department: async (parent) => (await db.select().from(Department).where(eq(Department.id, parent.departmentId))).at(0),
        },
        TV: {
          // @ts-ignore
          department: async (parent) => (await db.select().from(Department).where(eq(Department.id, parent.departmentId))).at(0),
        },
      },
      plugins: [useCookies()],
    })
  )

  .listen(3000);

console.log("🎉 Listening on http://localhost:3000");
