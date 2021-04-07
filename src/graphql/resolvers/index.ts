import { UserResolver } from "./UserResolver";
import { mergeResolvers } from "@graphql-tools/merge";

const resolvers = [UserResolver];

export default mergeResolvers(resolvers);
