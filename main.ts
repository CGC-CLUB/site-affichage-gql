import { Elysia } from "elysia";
import { yoga } from "@elysiajs/graphql-yoga";
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import * as resolvers from "@/graphql/resolvers";
import * as mutations from "@/graphql/mutations";
import { CreatePostInput, CreateUserInput, PostFilterInput, UserFilterInput } from "@/types";
import { Department, Post, User } from "@prisma/client";
import { cors } from "@elysiajs/cors";
import { schema } from "./graphql/schema";
import prisma from "./utils/prisma";

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
            return resolvers.me(req) as Promise<User>;
          },
        },
        Mutation: {
          login: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.login({ input: args.input, req }) as Promise<User>;
          },
          createUser: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.createUser({ input: args.input as CreateUserInput, req }) as Promise<User>;
          },
          createDepartment: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.createDepartment({ input: args.input, req }) as Promise<Department>;
          },
          createTV: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.createTV({ input: args.input, req });
          },
          createPost: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.createPost({ input: args.input as CreatePostInput, req }) as Promise<Post>;
          },
          validateUser: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.validateUser({ input: args.input, req }) as Promise<User>;
          },
          validatePost: (_, args, ctx) => {
            const req = ctx.request;
            return mutations.validatePost({ input: args.input, req }) as Promise<Post>;
          },
        },
        Department: {
          /*
           * why i'm i getting this error:
           * cuz the return type of the resolver is a promise + the type are not the same exactly (prisma got additional fields)
           * so i'm just ignoring them
           */
          // @ts-ignore
          chef: (parent) => prisma.user.findUnique({ where: { id: parent.chefId } }),
          // @ts-ignore
          TVs: (parent) => prisma.tVs.findMany({ where: { departmentId: parent.id } }),
          // @ts-ignore
          posts: (parent) => prisma.post.findMany({ where: { departmentId: parent.id } }),
        },
        User: {
          // @ts-ignore
          posts: (parent) => prisma.post.findMany({ where: { authorId: parent.id } }),
          // @ts-ignore
          department: (parent) => prisma.department.findUnique({ where: { id: parent.departmentId } }),
        },
        Post: {
          // @ts-ignore
          author: (parent) => prisma.user.findUnique({ where: { id: parent.authorId } }),
          // @ts-ignore
          department: (parent) => prisma.department.findUnique({ where: { id: parent.departmentId } }),
        },
        TV: {
          // @ts-ignore
          department: (parent) => prisma.department.findUnique({ where: { id: parent.departmentId } }),
        },
      },
      plugins: [useCookies()],
    })
  )

  .listen(3000);

console.log("🎉 Listening on http://localhost:3000");
