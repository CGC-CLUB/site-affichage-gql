import { Elysia } from "elysia";
import { yoga } from "@elysiajs/graphql-yoga";
import { useCookies } from "@whatwg-node/server-plugin-cookies";

const app = new Elysia()
  .use(
    yoga({
      typeDefs: /* GraphQL */ `
        type Query {
          hi: String
        }
      `,
      context: {
        name: "Mobius",
      },
      useContext(_) {},
      resolvers: {
        Query: {
          hi: async (parent, args, context) => context.name,
        },
      },
      plugins: [useCookies()],
    })
  )
  .listen(3000);

console.log("🎉 Listening on http://localhost:3000");
