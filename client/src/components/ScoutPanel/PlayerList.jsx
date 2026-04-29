import { ChevronLeft, ChevronRight, Swords } from "lucide-react";
import { ListSkeleton } from "./Skeletons";

const card = "overflow-hidden rounded-lg border border-[var(--line)] bg-[rgba(21,21,21,0.96)] shadow-[0_20px_70px_rgba(0,0,0,0.38)]";
const cardHead = "flex min-h-[62px] items-center justify-between gap-3.5 border-b border-[var(--line)] bg-[linear-gradient(180deg,rgba(242,242,242,0.03),transparent)] px-4 py-3.5";
const row = "grid min-h-[82px] grid-cols-[48px_minmax(0,1fr)] items-center gap-3.5 border-b border-[var(--line)] bg-transparent px-4 py-3.5 transition hover:bg-[rgba(0,224,148,0.09)] md:grid-cols-[54px_minmax(170px,1fr)_minmax(150px,0.6fr)_112px]";

export function PlayerList({ panel }) {
  return (
    <section className={card}>
      <div className={cardHead}>
        <h2 className="m-0 text-base">Jugadores</h2>
        <PlayerPager panel={panel} />
      </div>

      {panel.loading.list ? (
        <ListSkeleton />
      ) : panel.players.length === 0 ? (
        <div className="m-4 rounded-lg border border-transparent bg-[rgba(242,242,242,0.05)] px-4 py-3.5 text-center text-[var(--muted)]">No players found.</div>
      ) : (
        <div className="grid">
          {panel.players.map((player) => (
            <PlayerRow
              active={panel.activePlayer?.id === player.id}
              key={player.id}
              onCompare={panel.toggleCompare}
              onSelect={panel.selectPlayer}
              player={player}
              selected={panel.selectedIds.includes(player.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PlayerPager({ panel }) {
  return (
    <div className="inline-flex items-center gap-2 font-black text-[var(--muted)]">
      <button className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)]" disabled={panel.filters.page <= 1 || panel.loading.list} onClick={() => panel.changePage(panel.filters.page - 1)} aria-label="Previous page">
        <ChevronLeft size={18} />
      </button>
      <span>
        {panel.filters.page} / {panel.pagination.totalPages || 1}
      </span>
      <button className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)]" disabled={panel.filters.page >= panel.pagination.totalPages || panel.loading.list} onClick={() => panel.changePage(panel.filters.page + 1)} aria-label="Next page">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function PlayerRow({ active, onCompare, onSelect, player, selected }) {
  return (
    <article className={`${row} ${active ? "bg-[rgba(0,224,148,0.09)]" : ""}`} onClick={() => onSelect(player.id)}>
      <img className="size-12 rounded-full border border-[var(--line)] bg-[var(--surface-2)] object-cover md:size-[54px]" src={player.photoUrl} alt={player.name} />
      <div>
        <strong className="m-0 block overflow-hidden text-ellipsis whitespace-nowrap text-base">{player.name}</strong>
        <span className="text-[0.88rem] text-[var(--muted)]">
          {player.position} - {player.age} años - {player.nationality}
        </span>
      </div>
      <div className="col-start-2 flex min-w-0 items-center gap-2 md:col-auto">
        <img className="size-[30px] rounded-full border border-[var(--line)] bg-[var(--surface-2)] object-cover" src={player.team.logoUrl} alt={player.team.name} />
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.88rem] text-[var(--muted)]">{player.team.name}</span>
      </div>
      <button
        className={`col-span-full inline-flex min-h-[38px] items-center justify-center gap-2 rounded-lg px-3 font-black text-[var(--text)] md:col-auto md:min-w-[104px] ${selected ? "bg-[linear-gradient(135deg,var(--blue),var(--primary))]" : "bg-[rgba(242,242,242,0.08)]"}`}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onCompare(player.id);
        }}
      >
        <Swords size={15} />
        {selected ? "Seleccionado" : "Comparar"}
      </button>
    </article>
  );
}
