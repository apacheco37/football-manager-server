/*
  Warnings:

  - You are about to drop the column `match_id` on the `match_events` table. All the data in the column will be lost.
  - You are about to drop the column `away_ratings_id` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `home_ratings_id` on the `matches` table. All the data in the column will be lost.
  - Added the required column `match_result_id` to the `match_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `season_id` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_season_id` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "match_events" DROP CONSTRAINT "match_events_match_id_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_away_ratings_id_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_home_ratings_id_fkey";

-- DropIndex
DROP INDEX "matches_away_ratings_id_key";

-- DropIndex
DROP INDEX "matches_home_ratings_id_key";

-- AlterTable
ALTER TABLE "match_events" DROP COLUMN "match_id",
ADD COLUMN     "match_result_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "matches" DROP COLUMN "away_ratings_id",
DROP COLUMN "home_ratings_id",
ADD COLUMN     "season_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "current_season_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "match_results" (
    "id" SERIAL NOT NULL,
    "match_id" TEXT NOT NULL,
    "home_ratings_id" INTEGER NOT NULL,
    "away_ratings_id" INTEGER NOT NULL,

    CONSTRAINT "match_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leagues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_league_id" TEXT,

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "league_id" TEXT NOT NULL,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PastSeasons" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "match_results_match_id_key" ON "match_results"("match_id");

-- CreateIndex
CREATE UNIQUE INDEX "match_results_home_ratings_id_key" ON "match_results"("home_ratings_id");

-- CreateIndex
CREATE UNIQUE INDEX "match_results_away_ratings_id_key" ON "match_results"("away_ratings_id");

-- CreateIndex
CREATE UNIQUE INDEX "leagues_name_key" ON "leagues"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_PastSeasons_AB_unique" ON "_PastSeasons"("A", "B");

-- CreateIndex
CREATE INDEX "_PastSeasons_B_index" ON "_PastSeasons"("B");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_current_season_id_fkey" FOREIGN KEY ("current_season_id") REFERENCES "seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_results" ADD CONSTRAINT "match_results_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_results" ADD CONSTRAINT "match_results_home_ratings_id_fkey" FOREIGN KEY ("home_ratings_id") REFERENCES "match_ratings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_results" ADD CONSTRAINT "match_results_away_ratings_id_fkey" FOREIGN KEY ("away_ratings_id") REFERENCES "match_ratings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_match_result_id_fkey" FOREIGN KEY ("match_result_id") REFERENCES "match_results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_parent_league_id_fkey" FOREIGN KEY ("parent_league_id") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PastSeasons" ADD CONSTRAINT "_PastSeasons_A_fkey" FOREIGN KEY ("A") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PastSeasons" ADD CONSTRAINT "_PastSeasons_B_fkey" FOREIGN KEY ("B") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
