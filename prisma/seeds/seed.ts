import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const team1 = await prisma.team.upsert({
    where: { name: 'Hellriders' },
    update: {},
    create: {
      name: 'Hellriders'
    },
  });

  const team2 = await prisma.team.upsert({
    where: { name: 'Imperium' },
    update: {},
    create: {
      name: 'Imperium'
    },
  });

  console.log({ team1, team2 });

  const players = await prisma.player.createMany({
    data: [
      {
        firstName: 'John',
        lastName: 'Doe',
        age: 20,
        talent: 3,
        attacker: 15,
        midfielder: 10,
        defender: 7,
        goalkeeper: 2,
        teamID: team1.id
      },
      {
        firstName: 'Marc',
        lastName: 'Wasser',
        age: 29,
        talent: 4,
        attacker: 3,
        midfielder: 10,
        defender: 7,
        goalkeeper: 2,
        teamID: team1.id
      },
      {
        firstName: 'Paul',
        lastName: 'Stanley',
        age: 24,
        talent: 5,
        attacker: 4,
        midfielder: 9,
        defender: 10,
        goalkeeper: 3,
        teamID: team2.id
      },
      {
        firstName: 'Charles',
        lastName: 'Marden',
        age: 17,
        talent: 7,
        attacker: 5,
        midfielder: 8,
        defender: 7,
        goalkeeper: 1
      },
    ],
  });

  console.log({ players });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });