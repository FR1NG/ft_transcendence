/*
  Warnings:

  - You are about to drop the column `leagId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `Leag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_leagId_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "leagId";

-- DropTable
DROP TABLE "Leag";

-- CreateTable
CREATE TABLE "Achievments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Achievments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AchievmentsToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AchievmentsToUsers_AB_unique" ON "_AchievmentsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_AchievmentsToUsers_B_index" ON "_AchievmentsToUsers"("B");

-- AddForeignKey
ALTER TABLE "_AchievmentsToUsers" ADD CONSTRAINT "_AchievmentsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AchievmentsToUsers" ADD CONSTRAINT "_AchievmentsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
