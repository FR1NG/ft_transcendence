/*
  Warnings:

  - A unique constraint covering the columns `[notificationId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "notificationId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_notificationId_key" ON "Invitation"("notificationId");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
