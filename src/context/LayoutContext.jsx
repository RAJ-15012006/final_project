import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [layoutMode, setLayoutMode] = useState('standard');
  
  return (
    <LayoutContext.Provider value={{ layoutMode, setLayoutMode }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutSettings() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutSettings must be used within a LayoutProvider');
  }
  return context;
}
