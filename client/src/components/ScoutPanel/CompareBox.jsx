import { BarChart3, CalendarDays, Loader2, SlidersHorizontal, X } from "lucide-react";
import { CompareChart } from "./CompareChart";
import { ChartSkeleton } from "./Skeletons";

const card = "scroll-mt-[92px] overflow-hidden rounded-lg border border-[var(--line)] bg-[rgba(21,21,21,0.96)] shadow-[0_20px_70px_rgba(0,0,0,0.38)]";
const cardHead = "flex min-h-[62px] items-center justify-between gap-3.5 border-b border-[var(--line)] bg-[linear-gradient(180deg,rgba(242,242,242,0.03),transparent)] px-4 py-3.5";

export function CompareBox({
  compareError,
  comparison,
  loading,
  onSeasonChange,
  onTogglePlayer,
  seasonId,
  seasons,
  selectedIds,
  selectedSummaries
}) {
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
        <CompareControls onSeasonChange={onSeasonChange} seasonId={seasonId} seasons={seasons} />
        <SelectedPlayers onTogglePlayer={onTogglePlayer} selectedIds={selectedIds} selectedSummaries={selectedSummaries} />
      </div>

      {compareError ? <div className="mx-4 mb-3.5 rounded-lg border border-[rgba(255,107,107,0.45)] bg-[var(--danger-soft)] px-4 py-3.5 font-extrabold text-[#ffc9c9]">{compareError}</div> : null}
      <CompareContent comparison={comparison} loading={loading} />
    </section>
  );
}

function CompareControls({ onSeasonChange, seasonId, seasons }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto]">
      <label className="flex h-[46px] min-w-0 items-center gap-2.5 rounded-lg border border-[var(--line-strong)] bg-[#111] px-3 text-[var(--text)]">
        <CalendarDays size={17} />
        <select className="w-full border-0 bg-[#111] text-[var(--text)] outline-0" value={seasonId} onChange={(event) => onSeasonChange(event.target.value)} aria-label="Comparison season">
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function SelectedPlayers({ onTogglePlayer, selectedIds, selectedSummaries }) {
  return (
    <div className="flex min-h-12 flex-wrap items-center gap-2" aria-label="Selected players">
      {selectedIds.length === 0 ? (
        <span className="text-[0.88rem] text-[var(--muted)]">Selecciona un jugador de la lista.</span>
      ) : (
        selectedSummaries.map((player, index) => {
          const id = selectedIds[index];
          return (
            <button className="inline-flex max-w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,var(--blue),var(--primary))] px-2.5 py-2 text-[0.84rem] font-black text-[var(--text)] shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(0,0,0,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]" key={id} onClick={() => onTogglePlayer(id)}>
              {index + 1}. {player?.name || id}
              <X size={14} />
            </button>
          );
        })
      )}
      {selectedIds.length === 1 ? <span className="text-[0.88rem] text-[var(--muted)]">Puedes sumar otro jugador para comparar lado a lado.</span> : null}
    </div>
  );
}

function CompareContent({ comparison, loading }) {
  if (loading && !comparison) {
    return <ChartSkeleton />;
  }

  if (!comparison) {
    return <CompareEmpty />;
  }

  return (
    <div className="relative transition-[opacity,transform] duration-300 ease-out">
      <div className={loading ? "opacity-55 blur-[0.3px] transition-[opacity,filter] duration-300 ease-out" : "opacity-100 blur-0 transition-[opacity,filter] duration-300 ease-out"}>
        <CompareChart comparison={comparison} />
      </div>
      {loading ? (
        <div className="pointer-events-none absolute inset-x-4 top-3 z-[1] flex justify-end">
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,224,148,0.32)] bg-[rgba(15,15,15,0.84)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-[var(--primary)] shadow-[0_12px_30px_rgba(0,0,0,0.28)] backdrop-blur">
            <Loader2 className="animate-spin" size={14} />
            Actualizando
          </span>
        </div>
      ) : null}
    </div>
  );
}

function CompareEmpty() {
  return (
    <div className="grid min-h-[220px] place-items-center gap-2.5 px-7 py-7 text-center">
      <SlidersHorizontal className="text-[var(--primary)]" size={44} />
      <strong>Selecciona al menos 1 jugador.</strong>
      <span className="text-[0.88rem] text-[var(--muted)]">Usa el boton de comparar de la lista. Con 1 jugador ves sus metricas; con 2 o 3 comparas rendimientos.</span>
    </div>
  );
}
