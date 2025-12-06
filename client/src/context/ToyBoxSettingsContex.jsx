import React, { createContext, useState, useContext, useEffect } from 'react';
import { getApiBaseUrl } from '../utils/env';
import { decrementOneToy } from '../utils/API';

const ToyBoxSettingsContext = createContext();

export const ToyBoxSettingsProvider = ({ children }) => {
  const API_BASE_URL = getApiBaseUrl();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
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

  // Run on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  /**
   * -------------------------------------
   *  Donation handler (centralized!)
   * -------------------------------------
   */
  const handleDonation = async (toyCount) => {
    if (!toyCount || toyCount <= 0) return;

    try {
      for (let i = 0; i < toyCount; i++) {
        const { ok, status, data } = await decrementOneToy();
        if (!ok) console.warn("Failed to decrement:", status, data);
      }

      // Rehydrate after decrement
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
