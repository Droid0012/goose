-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PLAYER');

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "winnerId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Battles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleStats" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tapCount" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BattleStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE INDEX "Battles_endAt_idx" ON "Battles"("endAt");

-- CreateIndex
CREATE INDEX "Battles_winnerId_idx" ON "Battles"("winnerId");

-- CreateIndex
CREATE INDEX "Battles_createdAt_idx" ON "Battles"("createdAt");

-- CreateIndex
CREATE INDEX "BattleStats_userId_battleId_idx" ON "BattleStats"("userId", "battleId");

-- CreateIndex
CREATE UNIQUE INDEX "BattleStats_battleId_userId_key" ON "BattleStats"("battleId", "userId");

-- AddForeignKey
ALTER TABLE "Battles" ADD CONSTRAINT "Battles_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleStats" ADD CONSTRAINT "BattleStats_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleStats" ADD CONSTRAINT "BattleStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
