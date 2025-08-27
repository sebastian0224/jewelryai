"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { useState } from "react";
import { ImageViewModal } from "./ImageViewModal";

export function ImageCard({ image }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(image.cloudinaryUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `jewelry-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Card className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border group hover:shadow-xl transition-shadow">
        <div className="aspect-square bg-muted relative overflow-hidden">
          <img
            src={image.cloudinaryUrl}
            alt={`Generated jewelry with ${image.styleUsed} background`}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />

          {/* Overlay con botones */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-1" />
                {isLoading ? "..." : "Download"}
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
                {image.styleUsed} Background
              </h3>
              <p className="text-xs text-muted-foreground">
                {image.sizeUsed} • {formatDate(image.createdAt)}
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
