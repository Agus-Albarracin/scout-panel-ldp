import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getFilteredPage, getFilterOptions } from "./scoutPanelFilters.js";

const players = [
  {
    id: "merentiel",
    name: "Miguel Angel Merentiel Serrano",
    age: 30,
    nationality: "Argentina",
    position: "Second striker",
    team: { name: "CA Boca Juniors", country: "Argentina" }
  },
  {
    id: "colidio",
    name: "Facundo Colidio",
    age: 26,
    nationality: "Argentina",
    position: "Centre forward",
    team: { name: "CA River Plate", country: "Argentina" }
  },
  {
    id: "lautaro",
    name: "Lautaro Martinez",
    age: 28,
    nationality: "Argentina",
    position: "Forward",
    team: { name: "Inter", country: "Europe" }
  },
  {
    id: "bastoni",
    name: "Alessandro Bastoni",
    age: 27,
    nationality: "Europe",
    position: "Centre back",
    team: { name: "Inter", country: "Europe" }
  }
];

describe("scout panel filters", () => {
  it("filters by player nationality without confusing it with club country", () => {
    const result = getFilteredPage(players, { nationality: "Argentina", limit: 10 });

    assert.deepEqual(result.players.map((player) => player.id), ["merentiel", "colidio", "lautaro"]);
    assert.equal(result.pagination.total, 3);
  });

  it("filters by club country without confusing it with player nationality", () => {
    const result = getFilteredPage(players, { teamCountry: "Argentina", limit: 10 });

    assert.deepEqual(result.players.map((player) => player.id), ["merentiel", "colidio"]);
    assert.equal(result.pagination.total, 2);
  });

  it("combines position, age and country filters", () => {
    const result = getFilteredPage(players, {
      position: "Centre forward",
      teamCountry: "Argentina",
      minAge: "25",
      maxAge: "27",
      limit: 10
    });

    assert.deepEqual(result.players.map((player) => player.id), ["colidio"]);
  });

  it("searches across player, team, position and country text", () => {
    assert.deepEqual(getFilteredPage(players, { search: "boca", limit: 10 }).players.map((player) => player.id), ["merentiel"]);
    assert.deepEqual(getFilteredPage(players, { search: "forward", limit: 10 }).players.map((player) => player.id), ["colidio", "lautaro"]);
    assert.deepEqual(getFilteredPage(players, { search: "europe", limit: 10 }).players.map((player) => player.id), ["lautaro", "bastoni"]);
  });

  it("builds stable option lists from the cached player source", () => {
    const options = getFilterOptions(players);

    assert.deepEqual(options.nationalities, ["Argentina", "Europe"]);
    assert.deepEqual(options.teamCountries, ["Argentina", "Europe"]);
    assert.deepEqual(options.positions, ["Centre back", "Centre forward", "Forward", "Second striker"]);
  });

  it("keeps global filter options even when active filters are present", () => {
    const options = getFilterOptions(players, { teamCountry: "Argentina" });

    assert.deepEqual(options.nationalities, ["Argentina", "Europe"]);
    assert.deepEqual(options.positions, ["Centre back", "Centre forward", "Forward", "Second striker"]);
    assert.deepEqual(options.teamCountries, ["Argentina", "Europe"]);
  });

  it("paginates filtered results locally", () => {
    const result = getFilteredPage(players, { teamCountry: "Argentina", page: 2, limit: 1 });

    assert.deepEqual(result.players.map((player) => player.id), ["colidio"]);
    assert.deepEqual(result.pagination, { page: 2, limit: 1, total: 2, totalPages: 2 });
  });
});

