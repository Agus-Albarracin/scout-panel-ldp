import { DetailSkeleton } from "./Skeletons";

const card = "overflow-hidden rounded-lg border border-[var(--line)] bg-[rgba(21,21,21,0.96)] shadow-[0_20px_70px_rgba(0,0,0,0.38)]";
const cardHead = "flex min-h-[62px] items-center justify-between gap-3.5 border-b border-[var(--line)] bg-[linear-gradient(180deg,rgba(242,242,242,0.03),transparent)] px-4 py-3.5";

export function PlayerDetail({ player, loading }) {
  return (
    <section className={card}>
      <div className={cardHead}>
        <h2 className="m-0 text-base">Detalles</h2>
      </div>
      {loading ? (
        <DetailSkeleton />
      ) : !player ? (
        <div className="m-4 rounded-lg border border-transparent bg-[rgba(242,242,242,0.05)] px-4 py-3.5 text-center text-[var(--muted)]">Selecciona un jugador sin presionar "comparar".</div>
      ) : (
        <>
          <PlayerSummary player={player} />
          <PlayerSeasons stats={player.stats} />
        </>
      )}
    </section>
  );
}

function PlayerSummary({ player }) {
  return (
    <div className="flex gap-4 p-[18px]">
      <img className="size-[92px] rounded-lg border border-[var(--line)] bg-[var(--surface-2)] object-cover" src={player.photoUrl} alt={player.name} />
      <div>
        <h3 className="m-0 block text-base">{player.name}</h3>
        <p className="my-2 text-[0.88rem] text-[var(--muted)]">
          {player.position} - {player.age} - {player.nationality}
        </p>
        <span className="text-[0.88rem] text-[var(--muted)]">{player.team.name}</span>
      </div>
    </div>
  );
}

function PlayerSeasons({ stats }) {
  return (
    <div className="grid px-[18px] pb-[18px]">
      {stats.map((stat) => (
        <div className="grid gap-1 border-t border-[var(--line)] py-3" key={stat.season.id}>
          <strong>{stat.season.name}</strong>
          <span className="text-[0.88rem] text-[var(--muted)]">
            {stat.appearances} Partidos jugados - {stat.goals} goles - {stat.assists} asistencias
          </span>
        </div>
      ))}
    </div>
  );
}
