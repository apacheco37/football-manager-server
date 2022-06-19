import { gql } from "apollo-server-core";
import { Context } from "../core/apolloServer";
import { TeamWithMatches } from "./team.service";

const typeDefs = gql`
  type Team {
    id: ID!
    name: String!
    players: [Player!]!
    matches: [Match!]!
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
  Team: {
    matches: (team: TeamWithMatches, _args: never, { services }: Context) => {
      return services.teamService.getTeamMatches(team);
    },
  },
};

export { typeDefs, resolvers };
