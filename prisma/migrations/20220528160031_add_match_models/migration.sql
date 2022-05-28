-- CreateEnum
CREATE TYPE "MatchTeam" AS ENUM ('HOME', 'AWAY');

-- CreateEnum
CREATE TYPE "MatchEventType" AS ENUM ('GOAL', 'CARD', 'SUBSTITUTION', 'INJURY');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('ATTACKER', 'MIDFIELDER', 'DEFENDER', 'GOALKEEPER');

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "home_team_id" TEXT NOT NULL,
    "away_team_id" TEXT NOT NULL,
    "home_ratings_id" INTEGER NOT NULL,
    "away_ratings_id" INTEGER NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_ratings" (
    "id" SERIAL NOT NULL,
    "attack" DOUBLE PRECISION NOT NULL,
    "midfield" DOUBLE PRECISION NOT NULL,
    "defense" DOUBLE PRECISION NOT NULL,
    "goalkeeping" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "match_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_events" (
    "id" TEXT NOT NULL,
    "minute" INTEGER NOT NULL,
    "type" "MatchEventType" NOT NULL,
    "team" "MatchTeam" NOT NULL,
    "match_id" TEXT NOT NULL,

    CONSTRAINT "match_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players_on_lineups" (
    "id" SERIAL NOT NULL,
    "position" "Position" NOT NULL,
    "lineupTeam" "MatchTeam" NOT NULL,
    "player_id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,

    CONSTRAINT "players_on_lineups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MatchEventToPlayer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "matches_home_ratings_id_key" ON "matches"("home_ratings_id");

-- CreateIndex
CREATE UNIQUE INDEX "matches_away_ratings_id_key" ON "matches"("away_ratings_id");

-- CreateIndex
CREATE UNIQUE INDEX "_MatchEventToPlayer_AB_unique" ON "_MatchEventToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_MatchEventToPlayer_B_index" ON "_MatchEventToPlayer"("B");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_ratings_id_fkey" FOREIGN KEY ("home_ratings_id") REFERENCES "match_ratings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_ratings_id_fkey" FOREIGN KEY ("away_ratings_id") REFERENCES "match_ratings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players_on_lineups" ADD CONSTRAINT "players_on_lineups_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players_on_lineups" ADD CONSTRAINT "players_on_lineups_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatchEventToPlayer" ADD FOREIGN KEY ("A") REFERENCES "match_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatchEventToPlayer" ADD FOREIGN KEY ("B") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
