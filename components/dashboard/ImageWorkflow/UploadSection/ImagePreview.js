"use client";

import { Card, CardContent } from "@/components/ui/card";

export function ImagePreview({ imageUrl }) {
  return (
    <Card className="overflow-hidden bg-[#F0F0F0] border-[#A8A8A8] shadow-md">
      <CardContent className="p-4 md:p-6">
        <div className="aspect-square max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-inner border border-[#A8A8A8]/30">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Joyería subida"
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
      </CardContent>
    </Card>
  );
}
