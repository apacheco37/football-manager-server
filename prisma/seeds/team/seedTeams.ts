import { PrismaClient, User } from "@prisma/client";

export default async function seedTeams({
  prismaClient,
  data: { user1, user2 },
}: {
  prismaClient: PrismaClient;
  data: { user1: User; user2: User };
}) {
  const team1 = await prismaClient.team.upsert({
    where: { name: "Hellriders" },
    update: {},
    create: {
      name: "Hellriders",
      userID: user1.id,
    },
  });

  const team2 = await prismaClient.team.upsert({
    where: { name: "Imperium" },
    update: {},
    create: {
      name: "Imperium",
      userID: user2.id,
    },
  });

  return { team1, team2 };
}
