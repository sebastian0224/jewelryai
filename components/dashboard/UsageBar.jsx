"use client";

import { useUsage } from "@/components/dashboard/UsageContext";

export function UsageBar() {
  const { usageData, loading, error } = useUsage();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-secondary-foreground/70">
        <div className="w-20 h-2 bg-secondary-foreground/20 rounded animate-pulse" />
        <span>Loading...</span>
      </div>
    );
  }

  // Error state
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
