/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserOtp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserOtp_userId_key" ON "public"."UserOtp"("userId");
