import { prisma } from "../../lib/prisma";

export const seasonRepository = {
  async findAll() {
    return prisma.season.findMany({
      orderBy: { year: "desc" }
    });
  },

  async findById(id: string) {
    return prisma.season.findUnique({
      where: { id }
    });
  },

  async findLatest() {
    return prisma.season.findFirst({
      orderBy: { year: "desc" }
    });
  }
};
