const shimmer = "block rounded-lg bg-[linear-gradient(90deg,#202020,#2e2e2e,#202020)] bg-[length:220%_100%] animate-[shimmer_1.2s_linear_infinite]";
const playerRow = "grid min-h-[82px] grid-cols-[48px_minmax(0,1fr)] items-center gap-3.5 border-b border-[var(--line)] px-4 py-3.5 md:grid-cols-[54px_minmax(170px,1fr)_minmax(150px,0.6fr)_112px]";

export function ListSkeleton() {
  return (
    <div className="grid">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className={playerRow} key={index}>
          <span className={`${shimmer} size-12 rounded-full md:size-[54px]`} />
          <span className={`${shimmer} h-[18px] w-[min(220px,100%)]`} />
          <span className={`${shimmer} h-[18px] w-[min(150px,100%)]`} />
          <span className={`${shimmer} h-[38px] w-[104px]`} />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid gap-3 p-[18px]">
      <span className={`${shimmer} size-[92px]`} />
      <span className={`${shimmer} h-4 w-full`} />
      <span className={`${shimmer} h-4 w-full`} />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="grid gap-3 p-[18px]">
      <span className={`${shimmer} h-4 w-full`} />
      <span className={`${shimmer} h-4 w-full`} />
      <span className={`${shimmer} h-4 w-full`} />
    </div>
  );
}
