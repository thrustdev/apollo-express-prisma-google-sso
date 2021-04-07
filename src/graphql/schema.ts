import "graphql-import-node";
import typeDefs from "./type-defs";
import resolvers from "./resolvers";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
