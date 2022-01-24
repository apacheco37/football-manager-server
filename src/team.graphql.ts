import { gql } from "apollo-server-core";
import { Context } from "./apolloServer";

const typeDefs = gql`
  type Team {
    id: ID!
    name: String!
    players: [Player!]!
  }

  extend type Query {
    team(id: ID!): Team
  }
`;

const resolvers = {
  Query: {
    team: (
      _parent: never,
      args: { id: string },
      context: Context
    ) => context.prisma.team.findUnique({
      where: {
        id: args.id,
      },
    }),
  },
};

export { typeDefs, resolvers };
