"use client";

import { Card, CardContent } from "@/components/ui/card";

export function RecentCard({ imageUrl, caption, index }) {
  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <CardContent className="p-3">
        {/* Placeholder image */}
        <div className="aspect-square w-full mb-3 overflow-hidden rounded-md">
          <img
            src={imageUrl}
            alt={`Recent generation ${index}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* Caption */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {caption ||
              `Generated on ${new Date().toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
