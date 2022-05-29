import { Player, PrismaClient, Team, User } from "@prisma/client";
import * as bcrypt from "bcryptjs";

import { randomPlayer } from "../../src/player/player.utils";
import MatchSimulation from "../../src/match/match-simulation";
import { buildMatchCreateInput } from "../../src/match/match.utils";
import { Position } from "../../src/match/match.graphql";

const prisma = new PrismaClient();

async function main() {
  const { user1, user2 } = await seedUsers();
  const { team1, team2 } = await seedTeams(user1, user2);
  await seedMatch(team1, team2);
}

async function seedUsers() {
  const hashedPassword1 = await bcrypt.hash("testpassword", 10);
  const user1 = await prisma.user.upsert({
    where: { username: "testuser" },
    update: {},
    create: {
      username: "testuser",
      password: hashedPassword1,
      email: "a@a.com",
    },
  });

  const hashedPassword2 = await bcrypt.hash("testpassword2", 10);
  const user2 = await prisma.user.upsert({
    where: { username: "testuser2" },
    update: {},
    create: {
      username: "testuser2",
      password: hashedPassword2,
      email: "a2@a.com",
    },
  });

  return { user1, user2 };
}

async function seedTeams(user1: User, user2: User) {
  const team1 = await prisma.team.upsert({
    where: { name: "Hellriders" },
    update: {},
    create: {
      name: "Hellriders",
      userID: user1.id,
    },
  });

  const team2 = await prisma.team.upsert({
    where: { name: "Imperium" },
    update: {},
    create: {
      name: "Imperium",
      userID: user2.id,
    },
  });

  return { team1, team2 };
}

async function seedMatch(team1: Team, team2: Team) {
  const playersTeam1ToInsert = [];
  const playersTeam2ToInsert = [];
  for (let i = 0; i < 11; i++) {
    playersTeam1ToInsert.push(randomPlayer(team1.id, true));
  }
  for (let i = 0; i < 11; i++) {
    playersTeam2ToInsert.push(randomPlayer(team2.id, true));
  }

  await prisma.player.createMany({
    data: playersTeam1ToInsert,
  });
  await prisma.player.createMany({
    data: playersTeam2ToInsert,
  });

  const playersTeam1 = await prisma.player.findMany({
    where: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: { in: playersTeam1ToInsert.map((player) => player.id!) },
    },
  });
  const playersTeam2 = await prisma.player.findMany({
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

  const match = await prisma.match.create({
    data: buildMatchCreateInput(simulatedMatch),
  });

  return match;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
