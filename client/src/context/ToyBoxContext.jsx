// context/ToyBoxContext.js
import React, { createContext, useState, useContext } from 'react';

const ToyBoxContext = createContext();

export const ToyBoxProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(Date.now());

  // call this to trigger all components that depend on toyBoxSettings to refresh
  const triggerRefresh = () => setRefreshKey(Date.now());

  return (
    <ToyBoxContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </ToyBoxContext.Provider>
  );
};

export const useToyBox = () => useContext(ToyBoxContext);
