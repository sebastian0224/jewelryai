"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getUserUsage } from "@/lib/actions/usage-manager";
import { useUser } from "@clerk/nextjs";

const UsageContext = createContext(undefined);

export function useUsage() {
  const context = useContext(UsageContext);
  if (context === undefined) {
    throw new Error("useUsage must be used within a UsageProvider");
  }
  return context;
}

export function UsageProvider({ children }) {
  const { user } = useUser();
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usageStatus, setUsageStatus] = useState("loading");
  const [remainingImages, setRemainingImages] = useState(null);

  const loadUsageData = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getUserUsage(user.id);

      if (result.success) {
        setUsageData(result.data);
        setRemainingImages(result.data.remainingImages);
        setUsageStatus(result.data.isAtLimit ? "limit_reached" : "available");
        setError(null);
      } else {
        setError(result.error);
        setUsageStatus("available"); // Fallback
      }
    } catch (err) {
      setError("Failed to load usage information");
      setUsageStatus("available");
      console.error("Usage error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load when user changes
  useEffect(() => {
    if (user?.id) {
      loadUsageData();
    } else {
      setLoading(true);
      setUsageData(null);
      setError(null);
      setUsageStatus("loading");
    }
  }, [user?.id]);

  // Refresh function that components can call
  const refreshUsage = async () => {
    await loadUsageData();
  };

  const contextValue = {
    // Data
    usageData,
    loading,
    error,
    usageStatus,
    remainingImages,

    // Functions
    refreshUsage,
    loadUsageData,
  };

  return (
    <UsageContext.Provider value={contextValue}>
      {children}
    </UsageContext.Provider>
  );
}
