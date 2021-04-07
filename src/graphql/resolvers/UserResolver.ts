import { AuthenticationError } from "apollo-server-errors";
import { IResolvers } from "graphql-tools";
import { getTokenFromAuthCode } from "../../auth";
import { User, MutationGoogleLoginArgs } from "../generated";

export const UserResolver: IResolvers = {
  Query: {
    async authenticatedUser(
      _: void,
      args: void,
      context
    ): Promise<User | null> {
      return context.user;
    },
  },
  Mutation: {
    async googleLogin(
      _: void,
      args: MutationGoogleLoginArgs,
      context
    ): Promise<User> {
      const user = await getTokenFromAuthCode(args.code);
      if (user === null)
        throw new AuthenticationError("Failed to authenticate user");
      context.user = user;
      return user as User;
    },
  },
};
