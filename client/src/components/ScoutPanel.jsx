"use client";

import { Bell, Search, Shield } from "lucide-react";
import { useScoutPanel } from "@/hooks/useScoutPanel";
import { CompareBox } from "./ScoutPanel/CompareBox";
import { Filters } from "./ScoutPanel/Filters";
import { Metric } from "./ScoutPanel/Metric";
import { PlayerDetail } from "./ScoutPanel/PlayerDetail";
import { PlayerList } from "./ScoutPanel/PlayerList";

export function ScoutPanel() {
  const panel = useScoutPanel();

  return (
    <main className="mx-auto w-full max-w-[1440px] px-3 pb-8 pt-3 md:px-6 md:pb-9 md:pt-4">
      <header className="sticky top-0 z-10 -mx-3 -mt-3 mb-4 grid min-h-[74px] grid-cols-[auto_1fr_auto] items-center justify-between gap-4 border-b border-[var(--line)] bg-[#121212]/90 px-3 shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur md:-mx-6 md:-mt-4 md:mb-5 md:grid-cols-[220px_minmax(280px,560px)_120px] md:px-6">
        <a className="inline-flex w-max items-center gap-2.5 text-[var(--text)] no-underline" href="#" aria-label="LDP scout panel">
          <span className="grid size-[42px] place-items-center rounded-full border border-[rgba(0,224,148,0.7)] bg-[linear-gradient(145deg,rgba(0,224,148,0.16),rgba(12,101,212,0.2))] text-[var(--text)] shadow-[0_0_26px_rgba(0,224,148,0.22)]">
            <Shield size={22} />
          </span>
          <strong className="hidden text-[1.8rem] leading-none md:block">ldp</strong>
        </a>
      </header>

      <section className="mb-5 grid min-h-[210px] grid-cols-1 items-end gap-7 overflow-hidden rounded-lg border border-[var(--line)] bg-[linear-gradient(110deg,rgba(21,21,21,0.98),rgba(21,21,21,0.78)),repeating-linear-gradient(135deg,rgba(242,242,242,0.05)_0_1px,transparent_1px_12px)] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.38)] md:grid-cols-[minmax(0,1fr)_minmax(240px,410px)] md:p-8">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.08em] text-[var(--primary)]">Panel de scout</span>
          <h1 className="mt-2 max-w-[760px] text-[2.4rem] font-black leading-[0.93] tracking-normal md:text-[clamp(2.45rem,6vw,5.8rem)]">Buscá jugadores y comparalos</h1>
        </div>
        <p className="m-0 text-[1.02rem] leading-[1.55] text-[var(--muted)]">Comparé los jugadores que esta búscando desde un gráfico de métricas.</p>
      </section>

      <section className="mb-5 grid grid-cols-1 gap-3.5 md:grid-cols-3">
        <Metric label="Jugadores" value={panel.pagination.total} />
        <Metric label="Seleccionados" value={`${panel.selectedIds.length}/3`} />
        <Metric label="Temporada" value={panel.seasons.find((season) => season.id === panel.seasonId)?.name || "Latest"} />
      </section>

      <section className="mb-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="grid gap-5">
          <Filters panel={panel} />
          {panel.error ? <div className="rounded-lg border border-[rgba(255,107,107,0.45)] bg-[var(--danger-soft)] px-4 py-3.5 font-extrabold text-[#ffc9c9]">{panel.error}</div> : null}
          <PlayerList panel={panel} />
        </div>

        <aside className="grid gap-5 xl:sticky xl:top-[92px]">
          <PlayerDetail player={panel.activePlayer} loading={panel.loading.detail} />
        </aside>
      </section>

      <CompareBox panel={panel} />
    </main>
  );
}
