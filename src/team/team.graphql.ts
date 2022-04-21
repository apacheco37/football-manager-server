import { gql } from "apollo-server-core";
import { Context } from "../core/apolloServer";

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
    team: (_parent: never, { id }: { id: string }, { services }: Context) => {
      return services.teamService.getTeam(id);
    },
  },
};

export { typeDefs, resolvers };
