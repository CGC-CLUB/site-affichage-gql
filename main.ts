import { Elysia } from "elysia";
import { yoga } from "@elysiajs/graphql-yoga";
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import * as resolvers from "./graphql/resolvers";
import * as mutations from "./graphql/mutations";
import { CreatePostInput, CreateUserInput } from "./types";
import { Department, Post, User } from "@prisma/client";

const app = new Elysia()
  .use(
    yoga({
      typeDefs: /* GraphQL */ `
        enum Role {
          USER
          CHEF
          ADMIN
        }
        scalar DateTime

        type User {
          id: ID!
          first_name: String
          family_name: String
          email: String
          role: Role
          createdAt: DateTime
          updatedAt: DateTime
          posts: [Post]
          department: Department
        }

        type Post {
          id: ID!
          content: String
          author: User
          image: String
          createdAt: DateTime
          updatedAt: DateTime
        }

        type Department {
          id: ID!
          name: String
          chef: User
          TVs: [TV]
        }

        type TV {
          id: ID!
          name: String
          department: Department
          password: String
        }

        type Query {
          users: [User]
          user(id: ID!): User
          posts: [Post]
          post(id: ID!): Post
          departments: [Department]
          department(id: ID!): Department
          TVs: [TV]
          TV(id: ID!): TV
        }

        type Mutation {
          login(input: LoginInput!): User
          createUser(input: CreateUserInput!): User
          createPost(input: CreatePostInput!): Post
          createDepartment(input: CreateDepartmentInput!): Department
          createTV(input: CreateTVInput!): TV
        }

        input CreateUserInput {
          email: String!
          first_name: String!
          family_name: String!
          password: String!
          role: Role!
        }

        input CreatePostInput {
          content: String
          image: String
        }

        input CreateDepartmentInput {
          name: String!
          chef: String!
        }

        input CreateTVInput {
          name: String!
          department: String!
          password: String!
        }

        input LoginInput {
          email: String!
          password: String!
        }
      `,
      context: {
        name: "Mobius",
      },
      useContext(_) {},
      resolvers: {
        Query: {
          users: () => resolvers.getUsers(),
          user: (_, args) => resolvers.getUser(args.id),
          posts: () => resolvers.getPosts(),
          post: (_, args) => resolvers.getPost(args.id),
          departments: () => resolvers.getDepartments(),
          department: (_, args) => resolvers.getDepartment(args.id),
          TVs: () => resolvers.getTVs(),
          TV: (_, args) => resolvers.getTV(args.id),
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
        },
      },
      plugins: [useCookies()],
    })
  )
  .listen(3000);

console.log("🎉 Listening on http://localhost:3000");
