"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

export function UsageCard() {
  // Sample data for usage tracking
  const currentUsage = 7;
  const maxUsage = 10;
  const progressValue = (currentUsage / maxUsage) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Usage & Limits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Images generated</span>
            <span className="font-medium">
              {currentUsage} / {maxUsage}
            </span>
          </div>
          <Progress value={progressValue} className="w-full h-2" />
        </div>

        {/* Descriptive text */}
        <p className="text-sm text-muted-foreground">
          {currentUsage} / {maxUsage} images used this month
        </p>

        {/* Upgrade button */}
        <Button className="w-full" variant="default">
          Upgrade Plan
        </Button>

        {/* Additional information */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Your plan renews on the 1st of each month
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
