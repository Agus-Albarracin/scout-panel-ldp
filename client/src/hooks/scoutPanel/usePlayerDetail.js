"use client";

import { useState } from "react";
import { getPlayer } from "@/lib/api";

export function usePlayerDetail() {
  const [activePlayer, setActivePlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function selectPlayer(id) {
    setLoading(true);
    setError("");

    try {
      setActivePlayer(await getPlayer(id));
    } catch (requestError) {
      setError(requestError.message || "Unable to load player");
    } finally {
      setLoading(false);
    }
  }

  return {
    activePlayer,
    loading,
    error,
    selectPlayer
  };
}
