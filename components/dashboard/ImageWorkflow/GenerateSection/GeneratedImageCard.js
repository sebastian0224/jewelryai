"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function GeneratedImageCard({ image, isSelected, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    console.log("Saving image:", image.id);
    // Add save logic here
  };

  const handleDownload = () => {
    console.log("Downloading image:", image.id);
    // Add download logic here
  };

  const handleDiscard = () => {
    console.log("Discarding image:", image.id);
    // Add discard logic here
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 ${
        isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative aspect-square">
          <img
            src={image.imageUrl || "/placeholder.svg"}
            alt={`Generated with ${image.background} background`}
            className="w-full h-full object-cover"
          />

          {/* Selection Checkbox */}
          <div className="absolute top-2 left-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="bg-background/80 backdrop-blur-sm"
            />
          </div>

          {/* Hover Actions */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-2 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleSave}
                className="bg-background/90 hover:bg-background"
              >
                💾 Save
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                className="bg-background/90 hover:bg-background"
              >
                ⬇️ Download
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDiscard}
                className="bg-destructive/90 hover:bg-destructive"
              >
                🗑️ Discard
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
