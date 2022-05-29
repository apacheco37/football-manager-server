import { MatchTeam, Prisma } from "@prisma/client";

import { SimulatedMatch } from "./match-simulation";

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
