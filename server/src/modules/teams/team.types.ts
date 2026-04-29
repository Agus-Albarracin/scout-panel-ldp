import type { Prisma } from "../../generated/prisma/client";

export type TeamWithPlayers = Prisma.TeamGetPayload<{
  include: { players: true };
}>;
