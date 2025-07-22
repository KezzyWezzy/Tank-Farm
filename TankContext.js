import React, { createContext, useContext, useState } from 'react';

const TankContext = createContext();

export function TankProvider({ children }) {
  const [selectedTankId, setSelectedTankId] = useState('Tank_001');
  return (
    <TankContext.Provider value={{ selectedTankId, setSelectedTankId }}>
      {children}
    </TankContext.Provider>
  );
}

export function useTank() {
  return useContext(TankContext);
}