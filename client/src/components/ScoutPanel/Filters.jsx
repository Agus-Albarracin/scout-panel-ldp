import { RefreshCw, SlidersHorizontal, X } from "lucide-react";
import { useFilterPanelView } from "@/hooks/scoutPanel/useFilterPanelView";

const baseIconButton =
  "inline-flex size-[46px] items-center justify-center gap-2 rounded-lg font-black transition disabled:cursor-not-allowed disabled:opacity-60";
const primaryIconButton = `${baseIconButton} bg-[var(--primary)] text-[#07110d]`;
const secondaryIconButton = `${baseIconButton} relative border border-[var(--line-strong)] bg-[#111] text-[var(--text)]`;
const field =
  "h-[46px] min-w-0 rounded-lg border border-[var(--line-strong)] bg-[#111] px-3 text-[var(--text)] outline-0";

export function Filters({
  filters,
  filterOptions,
  loading,
  onApplyFilters,
  onRefresh,
  onReset,
  onUpdateFilter
}) {
  const filterPanel = useFilterPanelView({ filters, onApplyFilters });

  return (
    <form
      className="grid gap-2.5 rounded-lg border border-[var(--line)] bg-[rgba(21,21,21,0.96)] p-2.5 shadow-[0_20px_70px_rgba(0,0,0,0.38)]"
      onSubmit={filterPanel.submit}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_repeat(4,46px)] gap-2.5 md:grid-cols-[minmax(220px,1fr)_repeat(4,46px)]">
        <label className="flex h-[46px] min-w-0 items-center rounded-lg border border-[var(--line-strong)] bg-[#111]">
          <input
            className="h-full w-full min-w-0 border-0 bg-transparent px-3.5 text-[var(--text)] outline-0"
            name="search"
            value={filters.search}
            onChange={(event) => onUpdateFilter("search", event.target.value)}
            placeholder="Buscar jugador"
          />
        </label>

        <button
          className={secondaryIconButton}
          type="button"
          onClick={filterPanel.toggleOpen}
          aria-expanded={filterPanel.open}
          aria-label="Mostrar filtros"
          title="Mostrar filtros"
        >
          <SlidersHorizontal size={18} />
          {filterPanel.activeCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 grid size-[18px] place-items-center rounded-full border border-[rgba(0,224,148,0.5)] bg-[var(--primary)] text-[0.72rem] leading-none text-[#07110d]">
              {filterPanel.activeCount}
            </span>
          ) : null}
        </button>

        <button
          className={primaryIconButton}
          type="button"
          disabled={loading}
          onClick={onRefresh}
          title="Actualizar jugadores"
          aria-label="Actualizar jugadores"
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
        </button>

        {filterPanel.hasActive ? (
          <button
            className={secondaryIconButton}
            type="button"
            onClick={onReset}
            aria-label="Limpiar filtros"
            title="Limpiar filtros"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div
        className={`grid gap-2.5 overflow-hidden transition-[max-height,opacity,transform] duration-200 md:grid-cols-2 xl:grid-cols-5 ${
          filterPanel.open
            ? "max-h-[296px] translate-y-0 opacity-100 md:max-h-[184px] xl:max-h-[72px]"
            : "pointer-events-none max-h-0 -translate-y-1 opacity-0"
        }`}
      >
        <select
          className={field}
          name="position"
          value={filters.position}
          onChange={(event) => onUpdateFilter("position", event.target.value)}
          aria-label="Posicion"
        >
          <option value="">Posiciones</option>
          {filterOptions.positions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>

        <select
          className={field}
          name="nationality"
          value={filters.nationality}
          onChange={(event) => onUpdateFilter("nationality", event.target.value)}
          aria-label="Nacionalidad"
        >
          <option value="">Nacionalidad</option>
          {filterOptions.nationalities.map((nationality) => (
            <option key={nationality} value={nationality}>
              {nationality}
            </option>
          ))}
        </select>

        <select
          className={field}
          name="teamCountry"
          value={filters.teamCountry}
          onChange={(event) => onUpdateFilter("teamCountry", event.target.value)}
          aria-label="Pais del club"
        >
          <option value="">Pais del club</option>
          {filterOptions.teamCountries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <input
          className={field}
          name="minAge"
          type="number"
          min="0"
          value={filters.minAge}
          onChange={(event) => onUpdateFilter("minAge", event.target.value)}
          placeholder="Edad min."
          aria-label="Edad minima"
        />

        <input
          className={field}
          name="maxAge"
          type="number"
          min="0"
          value={filters.maxAge}
          onChange={(event) => onUpdateFilter("maxAge", event.target.value)}
          placeholder="Edad max."
          aria-label="Edad maxima"
        />
      </div>
    </form>
  );
}
