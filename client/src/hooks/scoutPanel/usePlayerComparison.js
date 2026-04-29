"use client";

import { useCallback, useEffect, useState } from "react";
import { comparePlayers } from "@/lib/api";

export function usePlayerComparison({ players, activePlayer, seasonId }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compareError, setCompareError] = useState("");

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
        setCompareError("Puedes seleccionar hasta 3 jugadores.");
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
        setCompareError("Selecciona al menos 1 jugador.");
      }
      setComparison(null);
      return;
    }

    if (!nextSeasonId) {
      setCompareError("Selecciona una temporada para ver las metricas.");
      return;
    }

    setLoading(true);
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
      setCompareError(requestError.message || "No se pudieron cargar las metricas");
    } finally {
      setLoading(false);
    }
  }, [seasonId, selectedIds]);

  useEffect(() => {
    if (selectedIds.length >= 1 && seasonId) {
      runCompare(selectedIds, seasonId, { silent: true });
    }
  }, [selectedIds, seasonId, runCompare]);

  return {
    selectedIds,
    selectedPlayers,
    comparison,
    loading,
    compareError,
    toggleCompare,
    runCompare
  };
}
