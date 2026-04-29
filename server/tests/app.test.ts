import request from "supertest";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { env } from "../src/config/env";

const mockPlayers = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Julian Alvarez",
    birthDate: new Date("2000-01-31"),
    nationality: "Argentina",
    position: "Forward",
    photoUrl: "https://placehold.co/300x300",
    teamId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    team: {
      id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      name: "Atletico Madrid",
      country: "Europe",
      logoUrl: "https://placehold.co/120x120"
    }
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Lautaro Martinez",
    birthDate: new Date("1997-08-22"),
    nationality: "Argentina",
    position: "Forward",
    photoUrl: "https://placehold.co/300x300",
    teamId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    team: {
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      name: "Inter",
      country: "Europe",
      logoUrl: "https://placehold.co/120x120"
    }
  }
];

const latestSeason = {
  id: "33333333-3333-4333-8333-333333333333",
  name: "2024/2025",
  year: 2025
};
const authHeader = {
  Authorization: `Bearer ${jwt.sign({ sub: "test-user" }, env.JWT_SECRET)}`
};

vi.mock("../src/modules/players/player.repository", () => ({
  playerRepository: {
    findMany: vi.fn(async () => mockPlayers),
    count: vi.fn(async () => mockPlayers.length),
    findById: vi.fn(),
    findByIds: vi.fn(async (ids: string[]) =>
      mockPlayers.filter((player) => ids.includes(player.id)).map((player) => ({
        ...player,
        stats: [
          {
            id: `stat-${player.id}`,
            playerId: player.id,
            seasonId: latestSeason.id,
            appearances: 10,
            goals: player.name === "Julian Alvarez" ? 5 : 4,
            assists: 2,
            yellowCards: 1,
            redCards: 0,
            minutesPlayed: 780,
            shots: 28,
            keyPasses: 16,
            tackles: 12,
            interceptions: 7,
            passAccuracy: 81.5,
            season: latestSeason
          }
        ]
      }))
    )
  }
}));

vi.mock("../src/modules/seasons/season.repository", () => ({
  seasonRepository: {
    findAll: vi.fn(async () => [{ id: "44444444-4444-4444-8444-444444444444", name: "2023/2024", year: 2024 }, latestSeason]),
    findById: vi.fn(async () => latestSeason),
    findLatest: vi.fn(async () => latestSeason)
  }
}));

import { app } from "../src/app";
import { playerRepository } from "../src/modules/players/player.repository";

describe("Scout Panel API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /health returns API status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      message: "Scout Panel API is running"
    });
  });

  it("rejects protected routes without token", async () => {
    const response = await request(app).get("/api/players");

    expect(response.status).toBe(401);
    expect(response.body.error.message).toBe("Authentication token is required");
  });

  it("GET /api/players returns paginated players", async () => {
    const response = await request(app).get("/api/players").set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1
    });
  });

  it("GET /api/players applies basic filters", async () => {
    const response = await request(app).get("/api/players?search=julian&position=Forward&nationality=Argentina&teamCountry=Europe&minAge=20&maxAge=30&page=2&limit=5").set(authHeader);

    expect(response.status).toBe(200);
    expect(playerRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        name: { contains: "julian", mode: "insensitive" },
        position: { equals: "Forward", mode: "insensitive" },
        nationality: { equals: "Argentina", mode: "insensitive" },
        team: { country: { equals: "Europe", mode: "insensitive" } }
      }),
      5,
      5
    );
  });

  it("GET /api/players/compare supports a single player profile", async () => {
    const response = await request(app).get("/api/players/compare?ids=11111111-1111-4111-8111-111111111111").set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body.players).toHaveLength(1);
    expect(playerRepository.findByIds).toHaveBeenCalledWith(["11111111-1111-4111-8111-111111111111"], latestSeason.id);
  });

  it("GET /api/players/compare parses comma-separated ids", async () => {
    const response = await request(app)
      .get("/api/players/compare?ids=11111111-1111-4111-8111-111111111111,22222222-2222-4222-8222-222222222222&seasonId=33333333-3333-4333-8333-333333333333")
      .set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body.players).toHaveLength(2);
    expect(playerRepository.findByIds).toHaveBeenCalledWith(
      ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222"],
      latestSeason.id
    );
  });

  it("GET /api/seasons/latest returns latest season", async () => {
    const response = await request(app).get("/api/seasons/latest").set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(latestSeason);
  });
});
