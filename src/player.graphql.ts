import { gql, AuthenticationError } from "apollo-server-core";
import { Context } from "./apolloServer";

const typeDefs = gql`
  type Player {
    id: ID!
    firstName: String
    lastName: String
    age: Int
    talent: Int
    attacker: Int
    midfielder: Int
    defender: Int
    goalkeeper: Int
    team: Team
  }

  extend type Query {
    player(id: ID!): Player
  }
`;

const resolvers = {
  Query: {
    player: (
      _parent: never,
      args: { id: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError(
          'User is not authenticated.'
        );
      }

      return context.prisma.player.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
};

export { typeDefs, resolvers };
