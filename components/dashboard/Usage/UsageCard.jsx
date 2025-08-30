"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getUserUsageAction } from "@/lib/actions/get-user-usage-action";

export function UsageCard() {
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
    try {
      const result = await getUserUsageAction(user.id);

      if (result.success) {
        setUsageData(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load usage data");
      console.error("Usage data error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Usage & Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              <div className="h-4 bg-muted rounded w-16 animate-pulse" />
            </div>
            <div className="h-2 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Usage & Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load usage data: {error}
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            onClick={loadUsageData}
            className="w-full mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!usageData) return null;

  const {
    currentUsage,
    maxUsage,
    plan,
    progressPercentage,
    daysUntilReset,
    isApproachingLimit,
    isAtLimit,
    resetDate,
  } = usageData;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Usage & Limits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Limit Alert */}
        {isAtLimit && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You've reached your monthly limit. Upgrade to generate more
              images.
            </AlertDescription>
          </Alert>
        )}

        {/* Approaching Limit Alert */}
        {isApproachingLimit && !isAtLimit && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You're approaching your monthly limit. Consider upgrading your
              plan.
            </AlertDescription>
          </Alert>
        )}

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Images generated</span>
            <span className="font-medium">
              {currentUsage} / {maxUsage}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className={`w-full h-2 ${
              isAtLimit
                ? "text-destructive"
                : isApproachingLimit
                ? "text-yellow-500"
                : ""
            }`}
          />
        </div>

        {/* Usage description */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {maxUsage - currentUsage > 0
              ? `${maxUsage - currentUsage} images remaining this month`
              : "Monthly limit reached"}
          </p>
          <p className="text-xs text-muted-foreground">
            Current plan: <span className="font-medium capitalize">{plan}</span>
          </p>
        </div>

        {/* Upgrade button - Visual only */}
        <Button
          className="w-full"
          variant={isApproachingLimit ? "default" : "outline"}
          disabled
        >
          Upgrade Plan
        </Button>

        {/* Reset information */}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Usage resets: {resetDate}</span>
            <span>{daysUntilReset} days left</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
