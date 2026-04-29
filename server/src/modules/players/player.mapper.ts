import { calculateAge } from "../../shared/utils/calculate-age";
import type { PlayerComparison, PlayerDetail, PlayerWithTeam } from "./player.types";

export function mapPlayerListItem(player: PlayerWithTeam) {
  return {
    id: player.id,
    name: player.name,
    age: calculateAge(player.birthDate),
    nationality: player.nationality,
    position: player.position,
    photoUrl: player.photoUrl,
    team: {
      id: player.team.id,
      name: player.team.name,
      country: player.team.country,
      logoUrl: player.team.logoUrl
    }
  };
}

export function mapPlayerDetail(player: PlayerDetail) {
  return {
    ...mapPlayerListItem(player),
    stats: player.stats
      .sort((a, b) => b.season.year - a.season.year)
      .map((stat) => ({
        season: {
          id: stat.season.id,
          name: stat.season.name,
          year: stat.season.year
        },
        appearances: stat.appearances,
        goals: stat.goals,
        assists: stat.assists,
        yellowCards: stat.yellowCards,
        redCards: stat.redCards,
        minutesPlayed: stat.minutesPlayed,
        shots: stat.shots,
        keyPasses: stat.keyPasses,
        tackles: stat.tackles,
        interceptions: stat.interceptions,
        passAccuracy: stat.passAccuracy
      }))
  };
}

export function mapPlayerComparison(player: PlayerComparison, seasonId: string) {
  const stat = player.stats.find((item) => item.seasonId === seasonId);

  return {
    id: player.id,
    name: player.name,
    age: calculateAge(player.birthDate),
    nationality: player.nationality,
    position: player.position,
    photoUrl: player.photoUrl,
    team: {
      name: player.team.name,
      logoUrl: player.team.logoUrl
    },
    stats: stat
      ? {
          appearances: stat.appearances,
          goals: stat.goals,
          assists: stat.assists,
          yellowCards: stat.yellowCards,
          redCards: stat.redCards,
          minutesPlayed: stat.minutesPlayed,
          shots: stat.shots,
          keyPasses: stat.keyPasses,
          tackles: stat.tackles,
          interceptions: stat.interceptions,
          passAccuracy: stat.passAccuracy
        }
      : null
  };
}
