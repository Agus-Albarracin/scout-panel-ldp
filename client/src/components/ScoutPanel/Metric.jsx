export function Metric({ label, value }) {
  return (
    <div className="relative min-h-[94px] overflow-hidden rounded-lg border border-[var(--line)] bg-[rgba(21,21,21,0.96)] p-[18px] shadow-[0_20px_70px_rgba(0,0,0,0.38)] after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-[linear-gradient(90deg,var(--primary),var(--blue),var(--violet))]">
      <span className="mb-2 block text-xs font-black uppercase text-[var(--muted)]">{label}</span>
      <strong className="text-[2rem] leading-none">{value}</strong>
    </div>
  );
}
