import { Elysia } from "elysia";
import { yoga } from "@elysiajs/graphql-yoga";
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import prisma from "./utils/primsa"; // Corrected the import name

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
          last_name: String
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
      `,
      context: {
        name: "Mobius",
      },
      useContext(_) {},
      resolvers: {
        Query: {
          users() {
            return prisma.user.findMany();
          },
          user(_, args) {
            return prisma.user.findUnique({
              where: {
                id: args.id,
              },
            });
          },
          posts() {
            return prisma.post.findMany();
          },
          post(_, args) {
            return prisma.post.findUnique({
              where: {
                id: args.id,
              },
            });
          },
          departments() {
            return prisma.department.findMany();
          },
          department(_, args) {
            return prisma.department.findUnique({
              where: {
                id: args.id,
              },
            });
          },
          TVs() {
            return prisma.tVs.findMany();
          },
          TV(_, args) {
            return prisma.tVs.findUnique({
              where: {
                id: args.id,
              },
            });
          },
        },
      },
      plugins: [useCookies()],
    })
  )
  .listen(3000);

console.log("🎉 Listening on http://localhost:3000");
