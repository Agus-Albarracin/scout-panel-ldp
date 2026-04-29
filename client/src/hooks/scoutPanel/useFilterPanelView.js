"use client";

import { useMemo, useState } from "react";
import { getCollapsedFilterCount, getFiltersFromForm, hasActiveFilters } from "./filterViewModel";

export function useFilterPanelView({ filters, onApplyFilters }) {
  const [open, setOpen] = useState(false);

  const activeCount = useMemo(() => getCollapsedFilterCount(filters), [filters]);
  const hasActive = useMemo(() => hasActiveFilters(filters), [filters]);

  function toggleOpen() {
    setOpen((current) => !current);
  }

  function submit(event) {
    event.preventDefault();
    onApplyFilters(getFiltersFromForm(event.currentTarget, filters));
  }

  return {
    activeCount,
    hasActive,
    open,
    submit,
    toggleOpen
  };
}
