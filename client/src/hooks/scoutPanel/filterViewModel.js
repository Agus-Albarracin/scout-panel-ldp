const FILTER_KEYS = ["search", "position", "nationality", "teamCountry", "minAge", "maxAge"];
const COLLAPSED_FILTER_KEYS = ["position", "nationality", "teamCountry", "minAge", "maxAge"];

export function hasActiveFilters(filters) {
  return FILTER_KEYS.some((key) => hasValue(filters[key]));
}

export function getCollapsedFilterCount(filters) {
  return COLLAPSED_FILTER_KEYS.filter((key) => hasValue(filters[key])).length;
}

export function getFiltersFromForm(form, currentFilters) {
  const data = form instanceof FormData ? form : new FormData(form);

  return {
    search: String(data.get("search") || "").trim(),
    position: String(data.get("position") || ""),
    nationality: String(data.get("nationality") || ""),
    teamCountry: String(data.get("teamCountry") || ""),
    minAge: String(data.get("minAge") || ""),
    maxAge: String(data.get("maxAge") || ""),
    limit: currentFilters.limit
  };
}

function hasValue(value) {
  return String(value || "").trim() !== "";
}
