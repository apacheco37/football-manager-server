import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

import { randomPlayer } from "../../src/player/player.utils";

const prisma = new PrismaClient();

async function main() {
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

  const players = [];
  for (let i = 0; i < 11; i++) {
    players.push(randomPlayer(team1.id));
  }
  for (let i = 0; i < 11; i++) {
    players.push(randomPlayer(team2.id));
  }

  await prisma.player.createMany({
    data: players,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
