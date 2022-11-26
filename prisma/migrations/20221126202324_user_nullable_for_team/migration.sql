-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_userID_fkey";

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "userID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
