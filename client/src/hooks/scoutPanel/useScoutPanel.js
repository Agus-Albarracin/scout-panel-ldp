"use client";

import { usePlayerCatalog } from "./usePlayerCatalog";
import { usePlayerComparison } from "./usePlayerComparison";
import { usePlayerDetail } from "./usePlayerDetail";

export function useScoutPanel() {
  const catalog = usePlayerCatalog();
  const detail = usePlayerDetail();
  const comparison = usePlayerComparison({
    players: catalog.players,
    activePlayer: detail.activePlayer,
    seasonId: catalog.seasonId
  });

  return {
    filters: catalog.filters,
    players: catalog.players,
    pagination: catalog.pagination,
    seasons: catalog.seasons,
    seasonId: catalog.seasonId,
    activePlayer: detail.activePlayer,
    selectedIds: comparison.selectedIds,
    selectedPlayers: comparison.selectedPlayers,
    selectedSummaries: comparison.selectedSummaries,
    comparison: comparison.comparison,
    loading: {
      list: catalog.loading,
      detail: detail.loading,
      compare: comparison.loading
    },
    error: detail.error || catalog.error,
    compareError: comparison.compareError,
    filterOptions: catalog.filterOptions,
    updateFilter: catalog.updateFilter,
    updateFilterDraft: catalog.updateFilterDraft,
    applyFilters: catalog.applyFilters,
    resetFilters: catalog.resetFilters,
    refreshPlayers: catalog.refreshPlayers,
    changePage: catalog.changePage,
    selectPlayer: detail.selectPlayer,
    toggleCompare: comparison.toggleCompare,
    runCompare: comparison.runCompare,
    setSeasonId: catalog.setSeasonId
  };
}
