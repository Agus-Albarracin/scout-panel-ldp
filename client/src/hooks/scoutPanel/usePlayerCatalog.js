"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getPlayers, getSeasons } from "@/lib/api";
import { getFilteredPage, getFilterOptions, initialFilters } from "./scoutPanelFilters";

export function usePlayerCatalog() {
  const [filters, setFilters] = useState(initialFilters);
  const [players, setPlayers] = useState([]);
  const [filterSource, setFilterSource] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [seasons, setSeasons] = useState([]);
  const [seasonId, setSeasonId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    setLoading(true);
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
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let ignore = false;

    async function boot() {
      setLoading(true);

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
          setLoading(false);
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

  return {
    filters,
    players,
    pagination,
    seasons,
    seasonId,
    loading,
    error,
    filterOptions,
    updateFilter,
    updateFilterDraft,
    applyFilters,
    resetFilters,
    refreshPlayers,
    changePage,
    setSeasonId
  };
}
