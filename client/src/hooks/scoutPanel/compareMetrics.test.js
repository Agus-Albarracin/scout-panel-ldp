import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildComparablePlayers } from "./compareMetrics.js";

describe("compare metrics", () => {
  it("normalizes raw season stats into 0-100 scores", () => {
    const [player] = buildComparablePlayers(
      [
        {
          id: "player-1",
          name: "Jugador",
          stats: {
            appearances: 10,
            goals: 12,
            assists: 4,
            yellowCards: 1,
            redCards: 0,
            minutesPlayed: 900,
            shots: 40,
            keyPasses: 25,
            tackles: 15,
            interceptions: 8,
            passAccuracy: 84
          }
        }
      ],
      ["#00e094"]
    );

    assert.equal(player.color, "#00e094");
    assert.equal(player.scores.passAccuracy, 84);
    assert.equal(player.scores.goalsP90, 100);
    assert.ok(player.averagePercentile >= 0 && player.averagePercentile <= 100);
  });
});
