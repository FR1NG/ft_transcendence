-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "isOtpActivated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpSecret" TEXT;
