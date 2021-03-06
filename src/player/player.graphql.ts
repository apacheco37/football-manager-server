import { gql } from "apollo-server-core";
import { Context } from "../core/apolloServer";

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
    players(teamID: ID!): [Player!]!
  }
`;

const resolvers = {
  Query: {
    player: (_parent: never, { id }: { id: string }, { services }: Context) => {
      return services.playerService.getPlayer(id);
    },
    players: (
      _parent: never,
      { teamID }: { teamID: string },
      { services }: Context
    ) => {
      return services.playerService.getPlayersByTeam(teamID);
    },
  },
};

export { typeDefs, resolvers };
