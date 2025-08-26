"use client";

import { Card, CardContent } from "@/components/ui/card";

export function ImagePreview({ imageUrl }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="aspect-square max-w-md mx-auto bg-muted rounded-lg overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Uploaded jewelry"
            className="w-full h-full object-contain"
          />
        </div>
      </CardContent>
    </Card>
  );
}
