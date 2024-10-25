/*
  Warnings:

  - You are about to drop the column `forename` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "forename",
DROP COLUMN "surname";
