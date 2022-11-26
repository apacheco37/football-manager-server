import { Player, PrismaClient, Team } from "@prisma/client";

import { randomPlayer } from "../../../src/player/player.utils";
import MatchSimulation from "../../../src/match/match-simulation";
import { buildMatchCreateInput } from "../../../src/match/match.utils";
import { Position } from "../../../src/match/match.graphql";

export default async function seedMatch({
  prismaClient,
  data: { team1, team2 },
}: {
  prismaClient: PrismaClient;
  data: { team1: Team; team2: Team };
}) {
  const playersTeam1ToInsert = [];
  const playersTeam2ToInsert = [];
  for (let i = 0; i < 11; i++) {
    playersTeam1ToInsert.push(randomPlayer(team1.id, true));
  }
  for (let i = 0; i < 11; i++) {
    playersTeam2ToInsert.push(randomPlayer(team2.id, true));
  }

  await prismaClient.player.createMany({
    data: playersTeam1ToInsert,
  });
  await prismaClient.player.createMany({
    data: playersTeam2ToInsert,
  });

  const playersTeam1 = await prismaClient.player.findMany({
    where: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: { in: playersTeam1ToInsert.map((player) => player.id!) },
    },
  });
  const playersTeam2 = await prismaClient.player.findMany({
    where: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: { in: playersTeam2ToInsert.map((player) => player.id!) },
    },
  });

  const homeLineup: { position: Position; player: Player }[] = [
    { position: Position.GOALKEEPER, player: playersTeam1[0] },
    { position: Position.DEFENDER, player: playersTeam1[1] },
    { position: Position.DEFENDER, player: playersTeam1[2] },
    { position: Position.DEFENDER, player: playersTeam1[3] },
    { position: Position.DEFENDER, player: playersTeam1[4] },
    { position: Position.MIDFIELDER, player: playersTeam1[5] },
    { position: Position.MIDFIELDER, player: playersTeam1[6] },
    { position: Position.MIDFIELDER, player: playersTeam1[7] },
    { position: Position.MIDFIELDER, player: playersTeam1[8] },
    { position: Position.ATTACKER, player: playersTeam1[9] },
    { position: Position.ATTACKER, player: playersTeam1[10] },
  ];
  const awayLineup: { position: Position; player: Player }[] = [
    { position: Position.GOALKEEPER, player: playersTeam2[0] },
    { position: Position.DEFENDER, player: playersTeam2[1] },
    { position: Position.DEFENDER, player: playersTeam2[2] },
    { position: Position.DEFENDER, player: playersTeam2[3] },
    { position: Position.DEFENDER, player: playersTeam2[4] },
    { position: Position.MIDFIELDER, player: playersTeam2[5] },
    { position: Position.MIDFIELDER, player: playersTeam2[6] },
    { position: Position.MIDFIELDER, player: playersTeam2[7] },
    { position: Position.MIDFIELDER, player: playersTeam2[8] },
    { position: Position.ATTACKER, player: playersTeam2[9] },
    { position: Position.ATTACKER, player: playersTeam2[10] },
  ];

  const simulatedMatch = new MatchSimulation({
    homeTeam: team1,
    awayTeam: team2,
    homeLineup,
    awayLineup,
  }).simulateMatch();

  const match = await prismaClient.match.create({
    data: buildMatchCreateInput(simulatedMatch),
  });

  return match;
}
