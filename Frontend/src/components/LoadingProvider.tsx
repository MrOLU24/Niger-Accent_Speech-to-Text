"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadingProgress: number;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const setLoading = (loading: boolean) => {
    if (!isClient) return; // Don't do anything on server side
    
    setIsLoading(loading);
    if (loading) {
      setLoadingProgress(0);
      
      // Simulate progressive loading
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 100);

      // Complete loading after a realistic delay
      const completionTimer = setTimeout(() => {
        setLoadingProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setLoadingProgress(0);
        }, 300);
      }, 1000 + Math.random() * 500); // 1-1.5 seconds

      // Store cleanup functions for potential cleanup
      const cleanup = () => {
        clearInterval(progressInterval);
        clearTimeout(completionTimer);
      };

      // Return cleanup function
      return cleanup;
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingProgress }}>
      {children}
    </LoadingContext.Provider>
  );
}
