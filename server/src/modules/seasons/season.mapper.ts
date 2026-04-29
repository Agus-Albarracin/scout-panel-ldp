import type { Season } from "../../generated/prisma/client";

export function mapSeason(season: Season) {
  return {
    id: season.id,
    name: season.name,
    year: season.year
  };
}
