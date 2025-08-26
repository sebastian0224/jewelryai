"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { RecentCard } from "./RecentCard";

export function RecentGrid() {
  // Sample data for recent generations
  const recentGenerations = [
    { id: 1, caption: "Generated on Jan 20, 2025" },
    { id: 2, caption: "Generated on Jan 19, 2025" },
    { id: 3, caption: "Generated on Jan 18, 2025" },
    { id: 4, caption: "Generated on Jan 17, 2025" },
    { id: 5, caption: "Generated on Jan 16, 2025" },
    { id: 6, caption: "Generated on Jan 15, 2025" },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Generations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Responsive grid of images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentGenerations.map((generation, index) => (
            <RecentCard
              key={generation.id}
              imageUrl="/placeholder-zv9kf.png"
              caption={generation.caption}
              index={generation.id}
            />
          ))}
        </div>

        {/* View All button */}
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent">
            View All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
