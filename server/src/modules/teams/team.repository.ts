import { prisma } from "../../lib/prisma";

export const teamRepository = {
  async findAll() {
    return prisma.team.findMany({
      orderBy: { name: "asc" }
    });
  },

  async findById(id: string) {
    return prisma.team.findUnique({
      where: { id },
      include: { players: true }
    });
  }
};
