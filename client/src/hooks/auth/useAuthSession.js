"use client";

import { useEffect, useState } from "react";
import { clearAuthToken, getAuthToken, getCurrentUser, login, registerAccount, setAuthToken } from "@/lib/api";

export function useAuthSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function restoreSession() {
      const token = getAuthToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (!ignore) {
          setUser(currentUser);
        }
      } catch {
        clearAuthToken();
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  async function signIn(credentials) {
    setSubmitting(true);
    setError("");

    try {
      const result = await login(credentials);
      setAuthToken(result.token);
      setUser(result.user);
    } catch (requestError) {
      setError(requestError.message || "No se pudo iniciar sesion");
    } finally {
      setSubmitting(false);
    }
  }

  async function signUp(data) {
    setSubmitting(true);
    setError("");

    try {
      const result = await registerAccount(data);
      setAuthToken(result.token);
      setUser(result.user);
    } catch (requestError) {
      setError(requestError.message || "No se pudo crear la cuenta");
    } finally {
      setSubmitting(false);
    }
  }

  function signOut() {
    clearAuthToken();
    setUser(null);
  }

  return {
    error,
    loading,
    submitting,
    user,
    signIn,
    signOut,
    signUp
  };
}
