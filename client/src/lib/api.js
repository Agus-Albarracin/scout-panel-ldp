const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function apiGet(path) {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const body = await response.json();
      message = body?.error?.message || message;
    } catch {
      // Keep the status-based message when the response does not include JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

function addParam(params, key, value) {
  if (value !== undefined && value !== null && String(value).trim() !== "") {
    params.set(key, String(value));
  }
}

export function getPlayers(filters) {
  const params = new URLSearchParams();

  addParam(params, "search", filters.search);
  addParam(params, "position", filters.position);
  addParam(params, "nationality", filters.nationality);
  addParam(params, "teamCountry", filters.teamCountry);
  addParam(params, "minAge", filters.minAge);
  addParam(params, "maxAge", filters.maxAge);
  addParam(params, "page", filters.page);
  addParam(params, "limit", filters.limit);

  return apiGet(`/api/players?${params.toString()}`);
}

export function getPlayer(id) {
  return apiGet(`/api/players/${id}`);
}

export function getSeasons() {
  return apiGet("/api/seasons");
}

export function comparePlayers(ids, seasonId) {
  const params = new URLSearchParams({ ids: ids.join(",") });
  addParam(params, "seasonId", seasonId);

  return apiGet(`/api/players/compare?${params.toString()}`);
}

