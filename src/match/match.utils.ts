import { MatchEventType, MatchTeam, Prisma } from "@prisma/client";

import { SimulatedMatch } from "./match-simulation";
import { MatchSummary } from "./match.graphql";
import { GetMatch } from "./match.service";

export function buildMatchCreateInput(
  simulatedMatch: SimulatedMatch
): Prisma.MatchCreateInput {
  const lineupPlayers = [
    ...simulatedMatch.homeLineup.map((player) => {
      return {
        position: player.position,
        playerID: player.player.id,
        lineupTeam: MatchTeam.HOME,
      };
    }),
    ...simulatedMatch.awayLineup.map((player) => {
      return {
        position: player.position,
        playerID: player.player.id,
        lineupTeam: MatchTeam.AWAY,
      };
    }),
  ];

  const events = simulatedMatch.events.map((event) => {
    return {
      minute: event.minute,
      type: event.type,
      team: event.team,
      players: {
        connect: event.players.map((player) => {
          return { id: player.id };
        }),
      },
    };
  });

  return {
    homeTeam: { connect: { id: simulatedMatch.homeTeam.id } },
    awayTeam: { connect: { id: simulatedMatch.awayTeam.id } },
    events: { create: events },
    homeRatings: { create: simulatedMatch.homeRatings },
    awayRatings: { create: simulatedMatch.awayRatings },
    lineupPlayers: { createMany: { data: lineupPlayers } },
  };
}

export function getMatchSummary(events: GetMatch["events"]): MatchSummary {
  const homeGoals = events.reduce(
    (goals, event) =>
      event.type === MatchEventType.GOAL && event.team === MatchTeam.HOME
        ? goals + 1
        : goals,
    0
  );
  const awayGoals = events.reduce(
    (goals, event) =>
      event.type === MatchEventType.GOAL && event.team === MatchTeam.AWAY
        ? goals + 1
        : goals,
    0
  );
  const homeCards = events.reduce(
    (goals, event) =>
      event.type === MatchEventType.CARD && event.team === MatchTeam.HOME
        ? goals + 1
        : goals,
    0
  );
  const awayCards = events.reduce(
    (goals, event) =>
      event.type === MatchEventType.CARD && event.team === MatchTeam.AWAY
        ? goals + 1
        : goals,
    0
  );

  return { homeGoals, awayGoals, homeCards, awayCards };
}
