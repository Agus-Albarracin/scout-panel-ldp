"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { comparePlayers, getPlayer, getPlayers, getSeasons } from "@/lib/api";
import { getFilteredPage, getFilterOptions, initialFilters } from "./scoutPanelFilters";

export function useScoutPanel() {
  const [filters, setFilters] = useState(initialFilters);
  const [players, setPlayers] = useState([]);
  const [filterSource, setFilterSource] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [seasons, setSeasons] = useState([]);
  const [seasonId, setSeasonId] = useState("");
  const [activePlayer, setActivePlayer] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState({ list: true, detail: false, compare: false });
  const [error, setError] = useState("");
  const [compareError, setCompareError] = useState("");

  const filterOptions = useMemo(() => {
    const source = filterSource.length > 0 ? filterSource : players;
    return getFilterOptions(source);
  }, [filterSource, players]);

  function applyLocalFilters(nextFilters, source = filterSource) {
    const result = getFilteredPage(source, nextFilters);
    setPlayers(result.players);
    setPagination(result.pagination);
    return result.filters;
  }

  const refreshPlayers = useCallback(async (nextFilters = filters) => {
    setLoading((current) => ({ ...current, list: true }));
    setError("");

    try {
      const result = await getPlayers({ ...initialFilters, limit: 100 });
      const source = result.data || [];
      const nextView = getFilteredPage(source, { ...filters, ...nextFilters });
      setFilterSource(source);
      setPlayers(nextView.players);
      setPagination(nextView.pagination);
      setFilters(nextView.filters);
    } catch (requestError) {
      setError(requestError.message || "Unable to load players");
      setPlayers([]);
    } finally {
      setLoading((current) => ({ ...current, list: false }));
    }
  }, [filters]);

  useEffect(() => {
    let ignore = false;

    async function boot() {
      setLoading((current) => ({ ...current, list: true }));

      try {
        const [playersResult, seasonsResult] = await Promise.all([
          getPlayers({ ...initialFilters, limit: 100 }),
          getSeasons()
        ]);

        if (ignore) return;

        const source = playersResult.data || [];
        const nextView = getFilteredPage(source, initialFilters);
        setFilterSource(source);
        setPlayers(nextView.players);
        setPagination(nextView.pagination);
        setSeasons(seasonsResult.data || []);
        setSeasonId(seasonsResult.data?.[0]?.id || "");
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || "Unable to load data");
        }
      } finally {
        if (!ignore) {
          setLoading((current) => ({ ...current, list: false }));
        }
      }
    }

    boot();

    return () => {
      ignore = true;
    };
  }, []);

  function updateFilter(key, value) {
    const nextFilters = {
      ...filters,
      [key]: value,
      page: key === "page" ? Number(value) : 1
    };

    setFilters(applyLocalFilters(nextFilters));
  }

  function updateFilterDraft(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === "page" ? Number(value) : 1
    }));
  }

  function applyFilters(nextFilters = filters) {
    const normalizedFilters = { ...initialFilters, ...nextFilters, page: 1 };
    setFilters(applyLocalFilters(normalizedFilters));
  }

  function resetFilters() {
    setFilters(initialFilters);
    applyLocalFilters(initialFilters);
  }

  function changePage(page) {
    const nextFilters = { ...filters, page };
    setFilters(applyLocalFilters(nextFilters));
  }

  async function selectPlayer(id) {
    setLoading((current) => ({ ...current, detail: true }));
    setError("");

    try {
      setActivePlayer(await getPlayer(id));
    } catch (requestError) {
      setError(requestError.message || "Unable to load player");
    } finally {
      setLoading((current) => ({ ...current, detail: false }));
    }
  }

  function getPlayerSummary(id) {
    return (
      players.find((player) => player.id === id) ||
      selectedPlayers.find((player) => player.id === id) ||
      comparison?.players.find((player) => player.id === id) ||
      (activePlayer?.id === id ? activePlayer : null)
    );
  }

  function toggleCompare(id) {
    setComparison(null);
    setCompareError("");

    setSelectedIds((current) => {
      if (current.includes(id)) {
        setSelectedPlayers((selected) => selected.filter((player) => player.id !== id));
        return current.filter((item) => item !== id);
      }

      if (current.length >= 3) {
        setCompareError("You can compare up to 3 players.");
        return current;
      }

      const player = getPlayerSummary(id);

      if (player) {
        setSelectedPlayers((selected) => [...selected.filter((item) => item.id !== id), player]);
      }

      return [...current, id];
    });
  }

  const runCompare = useCallback(async (ids = selectedIds, nextSeasonId = seasonId, options = {}) => {
    if (ids.length < 1) {
      if (!options.silent) {
        setCompareError("Select at least 1 player.");
      }
      setComparison(null);
      return;
    }

    if (!nextSeasonId) {
      setCompareError("Select a season to compare players.");
      return;
    }

    setLoading((current) => ({ ...current, compare: true }));
    setCompareError("");

    try {
      const result = await comparePlayers(ids, nextSeasonId);
      setComparison(result);
      setSelectedPlayers((selected) => {
        const byId = new Map(selected.map((player) => [player.id, player]));
        result.players.forEach((player) => byId.set(player.id, player));
        return ids.map((id) => byId.get(id)).filter(Boolean);
      });
    } catch (requestError) {
      setCompareError(requestError.message || "Unable to compare players");
    } finally {
      setLoading((current) => ({ ...current, compare: false }));
    }
  }, [seasonId, selectedIds]);

  function changeSeason(id) {
    setSeasonId(id);
  }

  useEffect(() => {
    if (selectedIds.length >= 1 && seasonId) {
      runCompare(selectedIds, seasonId, { silent: true });
    }
  }, [selectedIds, seasonId, runCompare]);

  return {
    filters,
    players,
    pagination,
    seasons,
    seasonId,
    activePlayer,
    selectedIds,
    selectedPlayers,
    comparison,
    loading,
    error,
    compareError,
    filterOptions,
    updateFilter,
    updateFilterDraft,
    applyFilters,
    resetFilters,
    refreshPlayers,
    changePage,
    selectPlayer,
    toggleCompare,
    runCompare,
    setSeasonId: changeSeason
  };
}

