import { PrismaClient } from "@prisma/client";

import seedUsers from "./user/seedUsers";
import seedTeams from "./team/seedTeams";
import seedMatch from "./match/seedMatch";

const prismaClient = new PrismaClient();

async function main() {
  const { user1, user2 } = await seedUsers(prismaClient);
  const { team1, team2 } = await seedTeams({
    prismaClient,
    data: { user1, user2 },
  });
  await seedMatch({ prismaClient, data: { team1, team2 } });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
