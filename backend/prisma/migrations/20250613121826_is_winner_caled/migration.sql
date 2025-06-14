/*
  Warnings:

  - You are about to drop the column `totalScore` on the `Battles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Battles" DROP COLUMN "totalScore",
ADD COLUMN     "resultsCalculated" BOOLEAN NOT NULL DEFAULT false;
