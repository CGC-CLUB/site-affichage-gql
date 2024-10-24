import { Elysia } from "elysia";
import { yoga } from "@elysiajs/graphql-yoga";
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import * as resolvers from "@/graphql/resolvers";
import * as mutations from "@/graphql/mutations";
import { CreatePostInput, CreateUserInput, PostFilterInput, UserFilterInput } from "@/types";
import { cors } from "@elysiajs/cors";
import { schema } from "./graphql/schema";
import { db } from "./prisma/db";
import { Department, Post, TVs, User, PostType, TVType, DepartmentType, UserType } from "./prisma/drizzle/schema";
import { eq } from "drizzle-orm";
import { GraphQLError } from "graphql";

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
          users: async (_, args) => (await resolvers.getUsers(args?.filter as UserFilterInput)) as UserType[],
          user: async (_, args) => (await resolvers.getUser(args.id)) as UserType | GraphQLError,
          posts: async (_, args) => (await resolvers.getPosts(args?.filter as PostFilterInput)) as PostType[],
          post: async (_, args) => (await resolvers.getPost(args.id)) as PostType | GraphQLError,
          departments: async () => (await resolvers.getDepartments()) as DepartmentType[],
          department: async (_, args) => (await resolvers.getDepartment(args.id)) as DepartmentType | GraphQLError,
          TVs: async () => (await resolvers.getTVs()) as TVType[],
          TV: async (_, args) => (await resolvers.getTV(args.id)) as TVType | GraphQLError,
          me: async (_, _args, ctx) => {
            const req = ctx.request;
            return (await resolvers.me(req)) as UserType;
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
          // @ts-ignore
          chef: async (parent: DepartmentType) => (await db.select().from(User).where(eq(User.id, parent.chefId))).at(0),
          // @ts-ignore
          TVs: async (parent: DepartmentType) => await db.select().from(TVs).where(eq(TVs.departmentId, parent.id)),
          // @ts-ignore
          posts: async (parent: DepartmentType) => await db.select().from(Post).where(eq(Post.departmentId, parent.id)),
        },
        User: {
          // @ts-ignore
          posts: async (parent: UserType) => (await db.select().from(Post).where(eq(Post.authorId, parent.id))) as PostType[],
          // @ts-ignore
          department: async (parent: UserType) => (await db.select().from(Department).where(eq(Department.id, parent.departmentId))).at(0),
        },
        Post: {
          // @ts-ignore
          author: async (parent: PostType) => (await db.select().from(User).where(eq(User.id, parent.authorId))).at(0),
          // @ts-ignore
          department: async (parent: PostType) => (await db.select().from(Department).where(eq(Department.id, parent.departmentId))).at(0),
        },
        TV: {
          // @ts-ignore
          department: async (parent: PostType) => (await db.select().from(Department).where(eq(Department.id, parent.departmentId))).at(0),
        },
      },
      plugins: [useCookies()],
    })
  )

  .listen(3000);

console.log("🎉 Listening on http://localhost:3000");
