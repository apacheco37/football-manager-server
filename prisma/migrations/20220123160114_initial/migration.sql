-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "talent" INTEGER NOT NULL,
    "attacker" INTEGER NOT NULL,
    "midfielder" INTEGER NOT NULL,
    "defender" INTEGER NOT NULL,
    "goalkeeper" INTEGER NOT NULL,
    "teamID" TEXT,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
