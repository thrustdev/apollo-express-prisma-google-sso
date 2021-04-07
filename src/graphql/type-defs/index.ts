import { mergeTypeDefs } from "@graphql-tools/merge";
import * as userTypeDefs from "./schemas/user.graphql";

const types = [userTypeDefs];

export default mergeTypeDefs(types);
