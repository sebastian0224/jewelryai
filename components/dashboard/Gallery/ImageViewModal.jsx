"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Trash2, X } from "lucide-react";
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
        onClose();
        onImageDeleted && onImageDeleted(image.id);
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
    return new Date(date).toLocaleDateString("en-US", {
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
      <DialogContent className="max-w-[95vw] sm:max-w-4xl xl:max-w-6xl w-full h-[90vh] sm:h-[85vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          Image View - {image.styleUsed || image.background} Background
        </DialogTitle>

        {/* Mobile Close Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 z-10 sm:hidden bg-black/50 border-white/20 text-white hover:bg-black/70"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="flex flex-col h-full sm:flex-row">
          {/* Main Image Container */}
          <div className="flex-1 bg-black flex items-center justify-center relative min-h-0">
            <img
              src={image.cloudinaryUrl || image.imageUrl}
              alt={`Generated jewelry with ${
                image.styleUsed || image.background
              } background`}
              className="w-90 h-full object-scale-down"
            />

            {/* Desktop Action Buttons - Top Right */}
            <div className="hidden sm:flex absolute top-4 right-4 gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                disabled={isDownloading || isDeleting}
                className="bg-black/50 border-white/20 text-white hover:bg-black/70"
              >
                <Download className="w-4 h-4 mr-1" />
                {isDownloading ? "..." : "Download"}
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting || isDownloading}
                className="bg-red-500/80 hover:bg-red-600/80"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {isDeleting ? "..." : "Delete"}
              </Button>
            </div>

            {/* Image Info Overlay - Bottom Left */}
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/80 backdrop-blur-sm text-white p-2 sm:p-3 rounded-lg max-w-[calc(100%-1rem)] sm:max-w-none">
              <h3 className="font-serif font-semibold text-sm sm:text-base truncate">
                {image.styleUsed || image.background} Background
              </h3>
              <p className="text-xs sm:text-sm opacity-80">
                {image.sizeUsed || image.size} • {formatDate(image.createdAt)}
              </p>
            </div>
          </div>

          {/* Mobile Action Bar - Bottom */}
          <div className="sm:hidden border-t border-border bg-card p-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                disabled={isDownloading || isDeleting}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download"}
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting || isDownloading}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
