// src/contexts/LoadingContext.tsx
import React, { createContext, useContext, useState } from "react";
import { LoadingContextProps } from "../types/loading";

export const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [progress, setProgress] = useState<number>(0);

  return (
    <LoadingContext.Provider value={{ progress, setProgress }}>
      {children}
    </LoadingContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = (): LoadingContextProps => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
