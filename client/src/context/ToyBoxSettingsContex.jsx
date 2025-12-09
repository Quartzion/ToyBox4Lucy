// ToyBoxSettingsContext.jsx
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { getApiBaseUrl } from '../utils/env';
import { decrementOneToy } from '../utils/API';

const ToyBoxSettingsContext = createContext();

export const ToyBoxSettingsProvider = ({ children }) => {
  const API_BASE_URL = getApiBaseUrl();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pollRef = useRef(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/toyBoxSettings`);
      if (!res.ok) throw new Error(`Status ${res.status}`);

      const data = await res.json();
      setSettings(Array.isArray(data) ? data[0] : data);
      setError(null);
    } catch (err) {
      console.error("ToyBoxSettings fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch (once)
  useEffect(() => {
    fetchSettings();
  }, []);

  // Poll every 50s — but pause if any overlay is active
  useEffect(() => {
    const startPolling = () => {
      if (pollRef.current) clearInterval(pollRef.current);

      pollRef.current = setInterval(() => {
        // If overlay is open, skip this cycle
        if (document.body.classList.contains('overlay-open')) {
          return;
        }
        fetchSettings();
      }, 50000);
    };

    startPolling();

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleDonation = async (toyCount) => {
    if (!toyCount || toyCount <= 0) return;

    try {
      for (let i = 0; i < toyCount; i++) {
        const { ok } = await decrementOneToy();
        if (!ok) console.warn("Failed to decrement");
      }
      await fetchSettings();
    } catch (err) {
      console.error("Donation decrement error:", err);
    }
  };

  return (
    <ToyBoxSettingsContext.Provider value={{
      settings,
      loading,
      error,
      refresh: fetchSettings,
      handleDonation
    }}>
      {children}
    </ToyBoxSettingsContext.Provider>
  );
};

export const useToyBoxSettings = () => useContext(ToyBoxSettingsContext);
