import { RefreshCw, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

const baseIconButton =
  "inline-flex size-[46px] items-center justify-center gap-2 rounded-lg font-black transition disabled:cursor-not-allowed disabled:opacity-60";

const primaryIconButton =
  `${baseIconButton} bg-[var(--primary)] text-[#07110d]`;

const secondaryIconButton =
  `${baseIconButton} relative border border-[var(--line-strong)] bg-[#111] text-[var(--text)]`;

const field =
  "h-[46px] min-w-0 rounded-lg border border-[var(--line-strong)] bg-[#111] px-3 text-[var(--text)] outline-0";

export function Filters({ panel }) {
  const [open, setOpen] = useState(false);

  const activeCount = [
    "position",
    "nationality",
    "teamCountry",
    "minAge",
    "maxAge",
  ].filter((key) => String(panel.filters[key] || "").trim() !== "").length;

  function submit(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    panel.applyFilters({
      search: String(form.get("search") || "").trim(),
      position: String(form.get("position") || ""),
      nationality: String(form.get("nationality") || ""),
      teamCountry: String(form.get("teamCountry") || ""),
      minAge: String(form.get("minAge") || ""),
      maxAge: String(form.get("maxAge") || ""),
      limit: panel.filters.limit,
    });
  }

  return (
    <form
      className="grid gap-2.5 rounded-lg border border-[var(--line)] bg-[rgba(21,21,21,0.96)] p-2.5 shadow-[0_20px_70px_rgba(0,0,0,0.38)]"
      onSubmit={submit}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_repeat(4,46px)] gap-2.5 md:grid-cols-[minmax(220px,1fr)_repeat(4,46px)]">
        <label className="flex h-[46px] min-w-0 items-center rounded-lg border border-[var(--line-strong)] bg-[#111]">
          <input
            className="h-full w-full min-w-0 border-0 bg-transparent px-3.5 text-[var(--text)] outline-0"
            name="search"
            value={panel.filters.search}
            onChange={(event) => panel.updateFilter("search", event.target.value)}
            placeholder="Buscar jugador"
          />
        </label>

        <button
          className={secondaryIconButton}
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label="Mostrar filtros"
          title="Mostrar filtros"
        >
          <SlidersHorizontal size={18} />

          {activeCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 grid size-[18px] place-items-center rounded-full border border-[rgba(0,224,148,0.5)] bg-[var(--primary)] text-[0.72rem] leading-none text-[#07110d]">
              {activeCount}
            </span>
          ) : null}
        </button>

        <button
          className={primaryIconButton}
          type="button"
          disabled={panel.loading.list}
          onClick={() => panel.refreshPlayers()}
          title="Actualizar jugadores"
          aria-label="Actualizar jugadores"
        >
          <RefreshCw
            className={panel.loading.list ? "animate-spin" : ""}
            size={18}
          />
        </button>

        {hasActiveFilters(panel.filters) ? (
          <button
            className={secondaryIconButton}
            type="button"
            onClick={panel.resetFilters}
            aria-label="Limpiar filtros"
            title="Limpiar filtros"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div
        className={`grid gap-2.5 overflow-hidden transition-[max-height,opacity,transform] duration-200 md:grid-cols-2 xl:grid-cols-5 ${
          open
            ? "max-h-[296px] translate-y-0 opacity-100 md:max-h-[184px] xl:max-h-[72px]"
            : "pointer-events-none max-h-0 -translate-y-1 opacity-0"
        }`}
      >
        <select
          className={field}
          name="position"
          value={panel.filters.position}
          onChange={(event) => panel.updateFilter("position", event.target.value)}
          aria-label="Posición"
        >
          <option value="">Todas las posiciones</option>
          {panel.filterOptions.positions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>

        <select
          className={field}
          name="nationality"
          value={panel.filters.nationality}
          onChange={(event) =>
            panel.updateFilter("nationality", event.target.value)
          }
          aria-label="Nacionalidad"
        >
          <option value="">Nacionalidad</option>
          {panel.filterOptions.nationalities.map((nationality) => (
            <option key={nationality} value={nationality}>
              {nationality}
            </option>
          ))}
        </select>

        <select
          className={field}
          name="teamCountry"
          value={panel.filters.teamCountry}
          onChange={(event) =>
            panel.updateFilter("teamCountry", event.target.value)
          }
          aria-label="País del club"
        >
          <option value="">País del club</option>
          {panel.filterOptions.teamCountries.map((country) => (
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
          value={panel.filters.minAge}
          onChange={(event) => panel.updateFilter("minAge", event.target.value)}
          placeholder="Edad min."
          aria-label="Edad mínima"
        />

        <input
          className={field}
          name="maxAge"
          type="number"
          min="0"
          value={panel.filters.maxAge}
          onChange={(event) => panel.updateFilter("maxAge", event.target.value)}
          placeholder="Edad max."
          aria-label="Edad máxima"
        />
      </div>
    </form>
  );
}

function hasActiveFilters(filters) {
  return ["search", "position", "nationality", "teamCountry", "minAge", "maxAge"].some(
    (key) => String(filters[key] || "").trim() !== ""
  );
}