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
        className={`bg-white rounded-2xl overflow-hidden shadow-lg border-2 group hover:shadow-2xl transition-all duration-300 ${
          isSelected
            ? "border-[#C9A227] ring-2 ring-[#C9A227]/20"
            : "border-[#A8A8A8] hover:border-[#C9A227]/50"
        }`}
      >
        <div className="aspect-square bg-[#F0F0F0] relative overflow-hidden">
          <img
            src={image.imageUrl || "/placeholder.svg"}
            alt={`Generated jewelry with ${image.background} background`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute top-3 left-3 z-20">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              className="bg-white/95 backdrop-blur-sm border-2 border-[#A8A8A8] shadow-lg data-[state=checked]:bg-[#C9A227] data-[state=checked]:border-[#C9A227] hover:bg-white transition-all duration-200 w-6 h-6"
            />
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
            <div className="flex gap-3">
              <Button
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-white/95 text-[#1A1A1A] hover:bg-[#C9A227] hover:text-white border-0 backdrop-blur-sm transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "..." : "Download"}
              </Button>
              <Button
                size="sm"
                onClick={() => setShowModal(true)}
                className="bg-white/95 text-[#1A1A1A] hover:bg-[#155E63] hover:text-white border-0 backdrop-blur-sm transition-all duration-200"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-3">
            <div>
              <h3 className="font-serif font-semibold text-lg text-[#1A1A1A]">
                {image.background} Background
              </h3>
              <p className="text-sm text-[#4D4D4D] font-medium">
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
