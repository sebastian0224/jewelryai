"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteImagesAction } from "@/lib/actions/gallery-actions";
import { useUser } from "@clerk/nextjs";

export function ImageViewModal({ isOpen, onClose, image, onImageDeleted }) {
  const { user } = useUser();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(image.cloudinaryUrl || image.imageUrl);
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
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete this image? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const result = await deleteImagesAction([image.id], user.id);

      if (result.success) {
        console.log(`Successfully deleted image ${image.id}`);
        onClose(); // Cerrar modal
        onImageDeleted && onImageDeleted(image.id); // Notificar al padre
      } else {
        console.error("Delete failed:", result.error);
        alert("Failed to delete image. Please try again.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete image. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
        {/* Hidden DialogTitle for accessibility */}
        <DialogTitle className="sr-only">
          Image View - {image.styleUsed || image.background} Background
        </DialogTitle>

        <div className="flex h-full">
          {/* Imagen */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <img
              src={image.cloudinaryUrl || image.imageUrl}
              alt={`Generated jewelry with ${
                image.styleUsed || image.background
              } background`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Botones de acción superpuestos */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                disabled={isDownloading || isDeleting}
              >
                <Download className="w-4 h-4 mr-1" />
                {isDownloading ? "..." : "Download"}
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting || isDownloading}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {isDeleting ? "..." : "Delete"}
              </Button>
            </div>

            {/* Info de la imagen superpuesta */}
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg">
              <h3 className="font-serif font-semibold">
                {image.styleUsed || image.background} Background
              </h3>
              <p className="text-sm opacity-80">
                {image.sizeUsed || image.size} • {formatDate(image.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
