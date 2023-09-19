/*
  Warnings:

  - The values [CEATED] on the enum `GameStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[byId,toId,type]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameStatus_new" AS ENUM ('CREATED', 'STARTED', 'FINISHED');
ALTER TABLE "Games" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Games" ALTER COLUMN "status" TYPE "GameStatus_new" USING ("status"::text::"GameStatus_new");
ALTER TYPE "GameStatus" RENAME TO "GameStatus_old";
ALTER TYPE "GameStatus_new" RENAME TO "GameStatus";
DROP TYPE "GameStatus_old";
ALTER TABLE "Games" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- DropIndex
DROP INDEX "Invitation_byId_toId_key";

-- AlterTable
ALTER TABLE "Games" ALTER COLUMN "status" SET DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "leagId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Leag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Leag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_byId_toId_type_key" ON "Invitation"("byId", "toId", "type");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_leagId_fkey" FOREIGN KEY ("leagId") REFERENCES "Leag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
