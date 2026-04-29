-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_stats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "appearances" INTEGER NOT NULL,
    "goals" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "yellowCards" INTEGER NOT NULL,
    "redCards" INTEGER NOT NULL,
    "minutesPlayed" INTEGER NOT NULL,
    "shots" INTEGER NOT NULL,
    "keyPasses" INTEGER NOT NULL,
    "tackles" INTEGER NOT NULL,
    "interceptions" INTEGER NOT NULL,
    "passAccuracy" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "player_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "players_name_idx" ON "players"("name");

-- CreateIndex
CREATE INDEX "players_position_idx" ON "players"("position");

-- CreateIndex
CREATE INDEX "players_nationality_idx" ON "players"("nationality");

-- CreateIndex
CREATE INDEX "players_teamId_idx" ON "players"("teamId");

-- CreateIndex
CREATE INDEX "player_stats_playerId_idx" ON "player_stats"("playerId");

-- CreateIndex
CREATE INDEX "player_stats_seasonId_idx" ON "player_stats"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "player_stats_playerId_seasonId_key" ON "player_stats"("playerId", "seasonId");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
