import { buildComparablePlayers, metricGroups, radarMetrics } from "@/hooks/scoutPanel/compareMetrics";

const playerColors = ["#7c5cff", "#ffb15c", "#00e094"];

export function CompareChart({ comparison }) {
  const percentilePlayers = buildComparablePlayers(comparison.players, playerColors);

  return (
    <div className="grid gap-5 px-4 pb-[18px] pt-2">
      <header className="grid grid-cols-1 gap-3 rounded-lg border border-[rgba(242,242,242,0.14)] bg-[linear-gradient(180deg,rgba(242,242,242,0.07),rgba(242,242,242,0.02)),rgba(17,17,17,0.54)] p-3 shadow-[inset_0_1px_0_rgba(242,242,242,0.06)] backdrop-blur md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {percentilePlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </header>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(360px,0.78fr)_minmax(0,1.22fr)]">
        <section className="rounded-lg border border-[rgba(242,242,242,0.14)] bg-[linear-gradient(180deg,rgba(242,242,242,0.055),rgba(242,242,242,0.015)),rgba(17,17,17,0.56)] p-[18px] shadow-[inset_0_1px_0_rgba(242,242,242,0.06),0_22px_60px_rgba(0,0,0,0.22)] backdrop-blur xl:sticky xl:top-[92px]">
          <div className="mb-2.5 grid gap-1">
            <span className="text-xs font-black uppercase tracking-[0.08em] text-[var(--primary)]">Estadisticas</span>
            <h3 className="m-0 text-base">Comparación de perfiles</h3>
          </div>
          <Radar players={percentilePlayers} />
          <Legend players={percentilePlayers} />
        </section>

        <MetricTable players={percentilePlayers} />
      </div>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        {percentilePlayers.map((player) => (
          <div className="grid gap-0.5 rounded-lg border border-[color-mix(in_srgb,var(--player-color),transparent_70%)] bg-[linear-gradient(120deg,color-mix(in_srgb,var(--player-color),transparent_84%),rgba(242,242,242,0.035)),rgba(17,17,17,0.5)] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(242,242,242,0.05)] backdrop-blur" key={player.id} style={{ "--player-color": player.color }}>
            <span className="text-[var(--muted)]">{player.name}</span>
            <strong className="text-[2rem] leading-none text-[var(--player-color)]">{player.averagePercentile}</strong>
            <small className="text-[var(--muted)]">Rendimiento corporativo</small>
          </div>
        ))}
      </section>
    </div>
  );
}

function PlayerCard({ player }) {
  return (
    <article className="grid min-h-[126px] grid-cols-[64px_minmax(0,1fr)] items-center gap-3.5 rounded-lg border border-[color-mix(in_srgb,var(--player-color),transparent_55%)] bg-[linear-gradient(120deg,color-mix(in_srgb,var(--player-color),transparent_82%),transparent_68%),rgba(29,29,29,0.58)] p-4 shadow-[inset_0_1px_0_rgba(242,242,242,0.06),0_18px_46px_rgba(0,0,0,0.18)] backdrop-blur md:grid-cols-[74px_minmax(0,1fr)_auto]" style={{ "--player-color": player.color }}>
      <img className="size-16 rounded-full border-2 border-[var(--player-color)] object-cover md:size-[74px]" src={player.photoUrl} alt={player.name} />
      <div>
        <span className="text-[var(--muted)]">{player.nationality}</span>
        <h3 className="mb-1 mt-0.5 text-[1.15rem]">{player.name}</h3>
        <p className="m-0 text-[var(--muted)]">
          {player.position} - {player.age} años
        </p>
        <small className="block text-[var(--muted)]">{player.team.name}</small>
      </div>
      <div className="col-span-full grid min-w-[74px] grid-cols-[repeat(4,auto)] items-baseline justify-start gap-x-2 gap-y-0.5 md:col-auto md:grid-cols-[auto_auto]">
        <strong className="text-[1.45rem] text-[var(--player-color)]">{player.averagePercentile}</strong>
        <span className="text-[var(--muted)]">pts.</span>
        <strong className="text-[1.45rem] text-[var(--player-color)]">{formatNumber(player.derivedStats.goals, 0)}</strong>
        <span className="text-[var(--muted)]">goles</span>
      </div>
    </article>
  );
}

function Radar({ players }) {
  const center = 170;
  const maxRadius = 126;
  const rings = [20, 40, 60, 80, 100];
  const axisPoints = radarMetrics.map((metric, index) => pointFor(index, radarMetrics.length, maxRadius, center));

  return (
    <svg className="h-auto min-h-[300px] w-full overflow-visible" viewBox="0 0 340 340" role="img" aria-label="Player performance radar">
      {rings.map((ring) => (
        <polygon key={ring} className="fill-none stroke-[rgba(242,242,242,0.18)] stroke-[1]" points={axisPoints.map((point) => pointToString(scalePoint(point, center, ring / 100))).join(" ")} />
      ))}

      {axisPoints.map((point, index) => (
        <line key={radarMetrics[index].key} className="fill-none stroke-[rgba(242,242,242,0.18)] stroke-[1]" x1={center} y1={center} x2={point.x} y2={point.y} />
      ))}

      {players.map((player) => {
        const points = radarMetrics.map((metric, index) => {
          const radius = ((player.scores[metric.key] || 0) / 100) * maxRadius;
          return pointFor(index, radarMetrics.length, radius, center);
        });

        return (
          <g key={player.id}>
            <polygon points={points.map(pointToString).join(" ")} fill={player.color} fillOpacity="0.28" stroke={player.color} strokeOpacity="0.95" strokeWidth="3" />
            {points.map((point, index) => (
              <circle key={`${player.id}-${radarMetrics[index].key}`} className="stroke-[var(--surface)] stroke-2" cx={point.x} cy={point.y} r="4" fill={player.color} />
            ))}
          </g>
        );
      })}

      {axisPoints.map((point, index) => {
        const labelPoint = scalePoint(point, center, 1.14);
        return (
          <text key={radarMetrics[index].key} className="hidden fill-[var(--muted)] text-[11px] md:block" textAnchor="middle" x={labelPoint.x} y={labelPoint.y}>
            {radarMetrics[index].label}
          </text>
        );
      })}
    </svg>
  );
}

function Legend({ players }) {
  return (
    <div className="flex flex-wrap gap-x-3.5 gap-y-2.5 text-[0.86rem] text-[var(--muted)]">
      {players.map((player) => (
        <span className="inline-flex items-center gap-2" key={player.id}>
          <i className="size-[9px] rounded-full" style={{ background: player.color }} />
          {player.name}
        </span>
      ))}
    </div>
  );
}

function MetricTable({ players }) {
  return (
    <section className="grid gap-3 rounded-lg border border-[rgba(242,242,242,0.14)] bg-[linear-gradient(180deg,rgba(242,242,242,0.055),rgba(242,242,242,0.015)),rgba(17,17,17,0.56)] p-3.5 shadow-[inset_0_1px_0_rgba(242,242,242,0.06),0_22px_60px_rgba(0,0,0,0.22)] backdrop-blur" style={{ "--columns": players.length }}>
      <div className="grid grid-cols-1 items-center gap-2.5 px-2 pb-0.5 text-[0.88rem] text-[var(--muted)] md:grid-cols-[minmax(190px,0.86fr)_repeat(var(--columns),minmax(130px,1fr))]">
        <span>Metricas</span>
        {players.map((player) => (
          <strong className="font-black text-[var(--player-color)]" key={player.id} style={{ "--player-color": player.color }}>
            {player.name}
          </strong>
        ))}
      </div>

      {metricGroups.map((group) => (
        <div className="grid gap-2" key={group.title}>
          <h3 className="mx-2 mb-0 mt-2.5 text-xs font-black uppercase tracking-[0.08em] text-[var(--muted)]">{group.title}</h3>
          {group.metrics.map((metric) => (
            <MetricRow key={metric.key} metric={metric} players={players} />
          ))}
        </div>
      ))}
    </section>
  );
}

function MetricRow({ metric, players }) {
  const bestValue = Math.max(...players.map((player) => player.scores[metric.key] || 0));

  return (
    <div className="grid min-h-[60px] grid-cols-1 items-center gap-2.5 rounded-lg border border-[rgba(242,242,242,0.045)] bg-[rgba(29,29,29,0.58)] p-2.5 shadow-[inset_0_1px_0_rgba(242,242,242,0.035)] md:grid-cols-[minmax(190px,0.86fr)_repeat(var(--columns),minmax(130px,1fr))]">
      <span className="font-extrabold">{metric.label}</span>
      {players.map((player) => {
        const score = player.scores[metric.key] || 0;
        const isLeader = score === bestValue && bestValue > 0;

        return (
          <div className="relative grid min-w-0 grid-cols-[auto_auto] gap-1.5 overflow-hidden pb-2" key={player.id} style={{ "--player-color": player.color }}>
            <b className="text-[1.03rem] text-[var(--text)]">
              {formatMetric(player.derivedStats[metric.raw], metric)}
              {isLeader ? <span className="ml-2 inline-block size-[7px] rounded-full bg-[var(--player-color)] align-middle shadow-[0_0_12px_var(--player-color)]" /> : null}
            </b>
            <small className="text-[var(--muted)]">{score} pts.</small>
            <i className="absolute bottom-0 left-0 h-[3px] min-w-[5px] rounded-full bg-[var(--player-color)] opacity-80" style={{ width: `${Math.max(4, score)}%` }} />
          </div>
        );
      })}
    </div>
  );
}

function pointFor(index, total, radius, center) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: round(center + Math.cos(angle) * radius, 2),
    y: round(center + Math.sin(angle) * radius, 2)
  };
}

function scalePoint(point, center, scale) {
  return {
    x: round(center + (point.x - center) * scale, 2),
    y: round(center + (point.y - center) * scale, 2)
  };
}

function pointToString(point) {
  return `${point.x},${point.y}`;
}

function formatMetric(value, metric) {
  return `${formatNumber(value, metric.decimals ?? 0)}${metric.suffix || ""}`;
}

function formatNumber(value, decimals) {
  return Number(value || 0).toLocaleString("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
