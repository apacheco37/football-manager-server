import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

export default async function seedUsers(prismaClient: PrismaClient) {
  const hashedPassword1 = await bcrypt.hash("testpassword", 10);
  const user1 = await prismaClient.user.upsert({
    where: { username: "testuser" },
    update: {},
    create: {
      username: "testuser",
      password: hashedPassword1,
      email: "a@a.com",
    },
  });

  const hashedPassword2 = await bcrypt.hash("testpassword2", 10);
  const user2 = await prismaClient.user.upsert({
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
