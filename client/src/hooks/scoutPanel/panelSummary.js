export function getSeasonLabel(seasons, seasonId) {
  return seasons.find((season) => season.id === seasonId)?.name || "Latest";
}
