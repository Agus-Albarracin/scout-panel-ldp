import { BarChart3, CalendarDays, Loader2, Swords, X } from "lucide-react";
import { CompareChart } from "./CompareChart";
import { ChartSkeleton } from "./Skeletons";

const card = "scroll-mt-[92px] overflow-hidden rounded-lg border border-[var(--line)] bg-[rgba(21,21,21,0.96)] shadow-[0_20px_70px_rgba(0,0,0,0.38)]";
const cardHead = "flex min-h-[62px] items-center justify-between gap-3.5 border-b border-[var(--line)] bg-[linear-gradient(180deg,rgba(242,242,242,0.03),transparent)] px-4 py-3.5";

export function CompareBox({ panel }) {
  return (
    <section className={card}>
      <div className={cardHead}>
        <div>
          <span className="text-xs font-black uppercase tracking-[0.08em] text-[var(--primary)]">Metricas y estadisticas</span>
          <h2 className="mt-0.5 text-base">Comparar jugadores</h2>
        </div>
        <BarChart3 size={20} />
      </div>

      <div className="grid grid-cols-1 gap-3.5 px-4 pb-2 pt-3.5 md:grid-cols-[minmax(260px,380px)_minmax(0,1fr)]">
        <CompareControls panel={panel} />
        <SelectedPlayers panel={panel} />
      </div>

      {panel.compareError ? <div className="mx-4 mb-3.5 rounded-lg border border-[rgba(255,107,107,0.45)] bg-[var(--danger-soft)] px-4 py-3.5 font-extrabold text-[#ffc9c9]">{panel.compareError}</div> : null}
      {panel.loading.compare ? <ChartSkeleton /> : panel.comparison ? <CompareChart comparison={panel.comparison} /> : <CompareEmpty />}
    </section>
  );
}

function CompareControls({ panel }) {
  const canCompare = panel.selectedIds.length >= 2 && !panel.loading.compare;

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto]">
      <label className="flex h-[46px] min-w-0 items-center gap-2.5 rounded-lg border border-[var(--line-strong)] bg-[#111] px-3 text-[var(--text)]">
        <CalendarDays size={17} />
        <select className="w-full border-0 bg-transparent text-[var(--text)] outline-0" value={panel.seasonId} onChange={(event) => panel.setSeasonId(event.target.value)} aria-label="Comparison season">
          {panel.seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>
      </label>
      <button className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 font-black text-[#07110d]" onClick={() => panel.runCompare()} disabled={!canCompare}>
        {panel.loading.compare ? <Loader2 className="animate-spin" size={16} /> : <Swords size={16} />}
        {panel.loading.compare ? "Comparando" : "Actualizar"}
      </button>
    </div>
  );
}

function SelectedPlayers({ panel }) {
  const selected = panel.selectedIds.map((id) => panel.selectedPlayers.find((item) => item.id === id) || panel.players.find((item) => item.id === id) || panel.comparison?.players.find((item) => item.id === id));

  return (
    <div className="flex min-h-12 flex-wrap items-center gap-2" aria-label="Selected players">
      {panel.selectedIds.length === 0 ? (
        <span className="text-[0.88rem] text-[var(--muted)]">Selecciona un jugador de la lista.</span>
      ) : (
        selected.map((player, index) => {
          const id = panel.selectedIds[index];
          return (
            <button className="inline-flex max-w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,var(--blue),var(--primary))] px-2.5 py-2 text-[0.84rem] font-black text-[var(--text)]" key={id} onClick={() => panel.toggleCompare(id)}>
              {index + 1}. {player?.name || id}
              <X size={14} />
            </button>
          );
        })
      )}
      {panel.selectedIds.length === 1 ? <span className="text-[0.88rem] text-[var(--muted)]">Choose one more player to compare.</span> : null}
    </div>
  );
}

function CompareEmpty() {
  return (
    <div className="grid min-h-[220px] place-items-center gap-2.5 px-7 py-7 text-center">
      <Swords className="text-[var(--primary)]" size={24} />
      <strong>Selecciona al menos 1 jugador.</strong>
      <span className="text-[0.88rem] text-[var(--muted)]">Usa el botón de comparar de la lista. Selecciona 2 jugadores. Analiza su rendimiento.</span>
    </div>
  );
}
