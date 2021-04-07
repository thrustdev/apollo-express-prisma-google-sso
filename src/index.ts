import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import schema from "./graphql/schema";

const PORT = 4000;

const app = express();

app.use(cors());

const server = new ApolloServer({
  schema,
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen(PORT, () => {
  console.log(
    `\n🚀 GraphQL is now running on http://localhost:${PORT}/graphql`
  );
});
