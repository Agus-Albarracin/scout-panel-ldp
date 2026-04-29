import { calculateAge } from "../../shared/utils/calculate-age";
import type { Team, Player } from "../../generated/prisma/client";
import type { TeamWithPlayers } from "./team.types";

export function mapTeam(team: Team) {
  return {
    id: team.id,
    name: team.name,
    country: team.country,
    logoUrl: team.logoUrl
  };
}

export function mapTeamDetail(team: TeamWithPlayers) {
  return {
    ...mapTeam(team),
    players: team.players
      .sort((a: Player, b: Player) => a.name.localeCompare(b.name))
      .map((player) => ({
        id: player.id,
        name: player.name,
        age: calculateAge(player.birthDate),
        nationality: player.nationality,
        position: player.position,
        photoUrl: player.photoUrl
      }))
  };
}
