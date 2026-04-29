export const initialFilters = {
  search: "",
  position: "",
  nationality: "",
  teamCountry: "",
  minAge: "",
  maxAge: "",
  page: 1,
  limit: 10
};

export function getFilterOptions(source) {
  return {
    positions: uniqueSorted(source.map((player) => player.position)),
    nationalities: uniqueSorted(source.map((player) => player.nationality)),
    teamCountries: uniqueSorted(source.map((player) => player.team?.country))
  };
}

export function getFilteredPage(source, nextFilters) {
  const filters = { ...initialFilters, ...nextFilters };
  const filtered = source.filter((player) => matchesPlayer(player, filters));
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || initialFilters.limit;
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;

  return {
    filters: { ...filters, page: safePage, limit },
    players: filtered.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      total: filtered.length,
      totalPages
    }
  };
}

function matchesPlayer(player, filters) {
  const search = String(filters.search || "").trim().toLowerCase();
  const minAge = toOptionalNumber(filters.minAge);
  const maxAge = toOptionalNumber(filters.maxAge);

  return (
    (!search || searchableText(player).includes(search)) &&
    (!filters.position || player.position === filters.position) &&
    (!filters.nationality || player.nationality === filters.nationality) &&
    (!filters.teamCountry || player.team?.country === filters.teamCountry) &&
    (minAge === undefined || player.age >= minAge) &&
    (maxAge === undefined || player.age <= maxAge)
  );
}

function searchableText(player) {
  return [player.name, player.position, player.nationality, player.team?.name, player.team?.country]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function toOptionalNumber(value) {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort();
}
