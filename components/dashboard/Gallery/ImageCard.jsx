"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ImageViewModal } from "./ImageViewModal";
import Image from "next/image";

export function ImageCard({ image, isSelected, onSelect, onImageDeleted }) {
  const [showModal, setShowModal] = useState(false);

  const handleCheckboxChange = (checked) => {
    onSelect(checked);
  };

  const handleImageClick = (e) => {
    // Si el click no fue en el checkbox, abrir modal
    if (!e.target.closest('[role="checkbox"]')) {
      setShowModal(true);
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
      <Card
        className={`bg-card rounded-2xl overflow-hidden shadow-lg border group hover:shadow-xl transition-all cursor-pointer ${
          isSelected ? "ring-2 ring-primary border-primary" : "border-border"
        }`}
      >
        <div
          className="aspect-square bg-muted relative overflow-hidden"
          onClick={handleImageClick}
        >
          <Image
            src={image.cloudinaryUrl}
            alt={`Generated jewelry with ${image.styleUsed} background`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Selection Checkbox - high z-index to avoid click conflicts */}
          <div
            className="absolute top-2 left-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              className="bg-background/90 backdrop-blur-sm border-2 border-white shadow-lg data-[state=checked]:bg-primary data-[state=checked]:border-primary hover:bg-background/95 transition-colors w-5 h-5"
            />
          </div>
        </div>

        <CardContent className="p-4" onClick={handleImageClick}>
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
        onImageDeleted={onImageDeleted}
      />
    </>
  );
}
