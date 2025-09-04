"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getUserUsage } from "@/lib/actions/usage-manager";

export function UsageBar() {
  const { user } = useUser();
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load usage data
  useEffect(() => {
    if (user?.id) {
      loadUsageData();
    }
  }, [user?.id]);

  const loadUsageData = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getUserUsage(user.id);

      if (result.success) {
        setUsageData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load usage");
      console.error("Usage bar error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-secondary-foreground/70">
        <div className="w-20 h-2 bg-secondary-foreground/20 rounded animate-pulse" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error || !usageData) {
    return (
      <div className="text-sm text-secondary-foreground/70">
        Usage unavailable
      </div>
    );
  }

  const { remainingImages, isAtLimit, resetDate, progressPercentage } =
    usageData;

  return (
    <div className="flex items-center gap-3 text-sm">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="w-20 h-2 bg-secondary-foreground/20 rounded overflow-hidden">
          <div
            className={`h-full rounded transition-all duration-300 ${
              isAtLimit ? "bg-destructive" : "bg-primary"
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Conditional text */}
      <span
        className={`font-medium ${
          isAtLimit ? "text-destructive" : "text-secondary-foreground"
        }`}
      >
        {isAtLimit
          ? `Limit reached • Resets ${resetDate}`
          : `${remainingImages} remaining`}
      </span>
    </div>
  );
}
