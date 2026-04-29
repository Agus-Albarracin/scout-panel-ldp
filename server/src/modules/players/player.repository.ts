import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export const playerRepository = {
  async findMany(where: Prisma.PlayerWhereInput, skip: number, take: number) {
    return prisma.player.findMany({
      where,
      skip,
      take,
      orderBy: { name: "asc" },
      include: { team: true }
    });
  },

  async count(where: Prisma.PlayerWhereInput) {
    return prisma.player.count({ where });
  },

  async findById(id: string) {
    return prisma.player.findUnique({
      where: { id },
      include: {
        team: true,
        stats: {
          include: { season: true }
        }
      }
    });
  },

  async findByIds(ids: string[], seasonId: string) {
    return prisma.player.findMany({
      where: { id: { in: ids } },
      include: {
        team: true,
        stats: {
          where: { seasonId },
          include: { season: true }
        }
      }
    });
  }
};
