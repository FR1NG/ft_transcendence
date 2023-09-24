-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('EASY', 'NORMAL', 'HARD');

-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "mode" "GameMode" NOT NULL DEFAULT 'EASY';
