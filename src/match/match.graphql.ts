import { gql } from "apollo-server-core";

import { Context } from "../core/apolloServer";
import { GetMatch } from "./match.service";
import { getMatchSummary } from "./match.utils";

const typeDefs = gql`
  type Match {
    id: ID!
    homeTeam: Team!
    awayTeam: Team!
    events: [MatchEvent!]!
    homeRatings: MatchRatings!
    awayRatings: MatchRatings!
    lineupPlayers: [PlayerOnLineup!]!
    summary: MatchSummary!
  }

  type MatchSummary {
    homeGoals: Int!
    awayGoals: Int!
    homeCards: Int!
    awayCards: Int!
  }

  type MatchEvent {
    id: ID!
    minute: Int!
    type: MatchEventType!
    team: MatchTeam!
    players: [Player!]!
  }

  enum MatchEventType {
    GOAL
    CARD
    SUBSTITUTION
    INJURY
  }

  enum MatchTeam {
    HOME
    AWAY
  }

  type MatchRatings {
    id: ID!
    attack: Float!
    midfield: Float!
    defense: Float!
    goalkeeping: Float!
  }

  type PlayerOnLineup {
    position: Position!
    player: Player!
    lineupTeam: MatchTeam!
  }

  enum Position {
    ATTACKER
    MIDFIELDER
    DEFENDER
    GOALKEEPER
  }

  input PlayerOnLineupInput {
    playerID: ID!
    position: Position!
  }

  input PlayMatchInput {
    homeTeamID: ID!
    awayTeamID: ID!
    homeLineup: [PlayerOnLineupInput!]!
    awayLineup: [PlayerOnLineupInput!]!
  }

  extend type Query {
    match(id: ID!): Match
  }

  extend type Mutation {
    playMatch(input: PlayMatchInput!): Match!
  }
`;

export enum Position {
  ATTACKER = "ATTACKER",
  MIDFIELDER = "MIDFIELDER",
  DEFENDER = "DEFENDER",
  GOALKEEPER = "GOALKEEPER",
}

export interface PlayerOnLineupInput {
  playerID: string;
  position: Position;
}

export interface PlayMatchInput {
  homeTeamID: string;
  awayTeamID: string;
  homeLineup: PlayerOnLineupInput[];
  awayLineup: PlayerOnLineupInput[];
}

export interface MatchSummary {
  homeGoals: number;
  awayGoals: number;
  homeCards: number;
  awayCards: number;
}

const resolvers = {
  Query: {
    match: (_parent: never, { id }: { id: string }, { services }: Context) => {
      return services.matchService.getMatch(id);
    },
  },
  Mutation: {
    playMatch: (
      _parent: never,
      { input }: { input: PlayMatchInput },
      { services }: Context
    ) => {
      return services.matchService.playMatch(input);
    },
  },
  Match: {
    summary: ({ events }: GetMatch) => {
      return getMatchSummary(events);
    },
  },
};

export { typeDefs, resolvers };
