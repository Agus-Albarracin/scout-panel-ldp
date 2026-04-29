const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TOKEN_KEY = "scout_panel_token";

async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store"
  });

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

async function apiGet(path) {
  return apiRequest(path);
}

async function apiPost(path, body) {
  return apiRequest(path, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function getAuthToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(TOKEN_KEY) || "";
}

export function setAuthToken(token) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export function login(credentials) {
  return apiPost("/api/auth/login", credentials);
}

export function registerAccount(data) {
  return apiPost("/api/auth/register", data);
}

export function getCurrentUser() {
  return apiGet("/api/auth/me");
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
