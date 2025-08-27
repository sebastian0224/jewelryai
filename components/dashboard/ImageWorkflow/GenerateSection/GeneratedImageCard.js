"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, ExternalLink } from "lucide-react";
import { useState } from "react";
import { ImageViewModal } from "@/components/dashboard/Gallery/ImageViewModal";

export function GeneratedImageCard({ image, isSelected, onSelect }) {
  const [showModal, setShowModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jewelry-${image.background}-${image.size}.jpg`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCheckboxChange = (checked) => {
    onSelect(checked);
  };

  return (
    <>
      <Card
        className={`bg-card rounded-2xl overflow-hidden shadow-lg border group hover:shadow-xl transition-all ${
          isSelected ? "ring-2 ring-primary border-primary" : "border-border"
        }`}
      >
        <div className="aspect-square bg-muted relative overflow-hidden">
          <img
            src={image.imageUrl}
            alt={`Generated jewelry with ${image.background} background`}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />

          {/* Selection Checkbox - FUERA del overlay para evitar conflictos */}
          <div className="absolute top-2 left-2 z-20">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              className="bg-background/90 backdrop-blur-sm border-2 border-white shadow-lg data-[state=checked]:bg-primary data-[state=checked]:border-primary hover:bg-background/95 transition-colors w-5 h-5"
            />
          </div>

          {/* Overlay con botones - z-index menor que el checkbox */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="w-4 h-4 mr-1" />
                {isDownloading ? "..." : "Download"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowModal(true)}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div>
              <h3 className="font-serif font-semibold text-card-foreground">
                {image.background} Background
              </h3>
              <p className="text-xs text-muted-foreground">
                {image.size} • Generated now
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ImageViewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        image={image}
      />
    </>
  );
}
