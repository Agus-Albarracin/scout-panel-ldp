import type { Prisma } from "../../generated/prisma/client";

export type PlayerListQuery = {
  search?: string;
  position?: string;
  nationality?: string;
  teamCountry?: string;
  minAge?: number;
  maxAge?: number;
  page?: number;
  limit?: number;
};

export type PlayerCompareQuery = {
  ids: string[];
  seasonId?: string;
};

export type PlayerWithTeam = Prisma.PlayerGetPayload<{
  include: { team: true };
}>;

export type PlayerDetail = Prisma.PlayerGetPayload<{
  include: {
    team: true;
    stats: { include: { season: true } };
  };
}>;

export type PlayerComparison = Prisma.PlayerGetPayload<{
  include: {
    team: true;
    stats: { include: { season: true } };
  };
}>;
