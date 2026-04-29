export const metricGroups = [
  {
    title: "Zona ofensiva",
    metrics: [
      { key: "goalsP90", label: "Goles", raw: "goals", decimals: 2, max: 1 },
      { key: "expectedGoalsP90", label: "Expectativa de gol (xG)", raw: "expectedGoals", decimals: 2, max: 1 },
      { key: "shotsP90", label: "Disparos", raw: "shots", decimals: 2, max: 5 },
      { key: "goalConversion", label: "Eficacia", raw: "goalConversion", suffix: "%", decimals: 0, max: 100 }
    ]
  },
  {
    title: "Oportunidades creadas",
    metrics: [
      { key: "assistsP90", label: "Asistencias", raw: "assists", decimals: 2, max: 0.6 },
      { key: "expectedAssistsP90", label: "Expec. de asistencias (xA)", raw: "expectedAssists", decimals: 2, max: 0.6 },
      { key: "keyPassesP90", label: "Pases claves", raw: "keyPasses", decimals: 2, max: 4 },
      { key: "successfulPassesP90", label: "Pases logrados", raw: "successfulPasses", decimals: 2, max: 80 },
      { key: "passAccuracy", label: "% pases logrados", raw: "passAccuracy", suffix: "%", decimals: 0, max: 100 }
    ]
  },
  {
    title: "Ritmo de trabajo",
    metrics: [
      { key: "recoveriesP90", label: "Recuperacion de pelota", raw: "recoveries", decimals: 2, max: 6 },
      { key: "defActionsP90", label: "Intervencion defensiva", raw: "defActions", decimals: 2, max: 6.5 },
      { key: "minutesShare", label: "Minutos jugados", raw: "minutesPlayed", suffix: "%", decimals: 0, max: 100 },
      { key: "cardDiscipline", label: "Disciplina", raw: "cardDiscipline", suffix: "%", decimals: 0, max: 100 }
    ]
  }
];

export const radarMetrics = [
  { key: "recoveriesP90", label: "Recuperaciones", max: 6 },
  { key: "defActionsP90", label: "Acciones defensivas", max: 6.5 },
  { key: "shotsP90", label: "Disparos", max: 5 },
  { key: "goalConversion", label: "Eficacia", max: 100 },
  { key: "keyPassesP90", label: "Pases claves", max: 4 },
  { key: "passAccuracy", label: "% pases logrados", max: 100 },
  { key: "minutesShare", label: "Minutos", max: 100 },
  { key: "assistsP90", label: "Asistencias", max: 0.6 },
  { key: "goalsP90", label: "Goles", max: 1 }
];

export function buildComparablePlayers(players, colors) {
  return withPercentiles(
    players.map((player, index) => ({
      ...player,
      color: colors[index % colors.length],
      derivedStats: buildDerivedStats(player.stats)
    }))
  );
}

function buildDerivedStats(stats) {
  const source = stats || {};
  const minutes = Number(source.minutesPlayed) || 0;
  const per90Factor = minutes > 0 ? 90 / minutes : 0;
  const goals = Number(source.goals) || 0;
  const assists = Number(source.assists) || 0;
  const shots = Number(source.shots) || 0;
  const keyPasses = Number(source.keyPasses) || 0;
  const tackles = Number(source.tackles) || 0;
  const interceptions = Number(source.interceptions) || 0;
  const passAccuracy = Number(source.passAccuracy) || 0;
  const yellowCards = Number(source.yellowCards) || 0;
  const redCards = Number(source.redCards) || 0;
  const successfulPasses = Math.round((passAccuracy / 100) * Math.max(0, keyPasses * 8 + minutes / 7));
  const recoveries = tackles + interceptions;
  const defActions = tackles + interceptions * 1.25;
  const cardPenalty = yellowCards * 8 + redCards * 25;

  return {
    appearances: Number(source.appearances) || 0,
    goals,
    assists,
    shots,
    expectedGoals: round(shots * 0.11 + goals * 0.18, 2),
    expectedAssists: round(keyPasses * 0.08 + assists * 0.14, 2),
    keyPasses,
    tackles,
    interceptions,
    recoveries,
    defActions,
    successfulPasses,
    minutesPlayed: minutes,
    goalsP90: round(goals * per90Factor, 2),
    expectedGoalsP90: round((shots * 0.11 + goals * 0.18) * per90Factor, 2),
    shotsP90: round(shots * per90Factor, 2),
    goalConversion: shots > 0 ? round((goals / shots) * 100, 0) : 0,
    assistsP90: round(assists * per90Factor, 2),
    expectedAssistsP90: round((keyPasses * 0.08 + assists * 0.14) * per90Factor, 2),
    keyPassesP90: round(keyPasses * per90Factor, 2),
    successfulPassesP90: round(successfulPasses * per90Factor, 2),
    passAccuracy,
    recoveriesP90: round(recoveries * per90Factor, 2),
    defActionsP90: round(defActions * per90Factor, 2),
    minutesShare: round(Math.min(100, (minutes / 1170) * 100), 0),
    cardDiscipline: Math.max(0, 100 - cardPenalty)
  };
}

function withPercentiles(players) {
  const allMetrics = metricGroups.flatMap((group) => group.metrics);
  const metricMaxByKey = new Map(allMetrics.map((metric) => [metric.key, metric.max]));

  return players.map((player) => {
    const scores = Object.fromEntries(
      allMetrics.map((metric) => [
        metric.key,
        scoreFor(Number(player.derivedStats[metric.key]) || 0, metric.max)
      ])
    );
    const radarValues = radarMetrics.map((metric) => scores[metric.key] || scoreFor(Number(player.derivedStats[metric.key]) || 0, metricMaxByKey.get(metric.key) || metric.max));
    const averagePercentile = Math.round(radarValues.reduce((total, value) => total + value, 0) / radarValues.length);

    return {
      ...player,
      scores,
      averagePercentile
    };
  });
}

function scoreFor(value, max) {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return 0;
  }

  return clampInt((value / max) * 100, 0, 100);
}

function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clampInt(value, min, max) {
  return Math.round(Math.max(min, Math.min(max, value)));
}
