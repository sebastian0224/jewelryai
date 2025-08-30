"use client";

import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { useState } from "react";

export function BatchActionsGallery({
  selectedCount,
  totalCount,
  selectedImages,
  onDeleteSelected,
  isDeleting = false,
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleBatchDownload = async () => {
    if (selectedImages.length === 0) return;

    setIsDownloading(true);
    try {
      if (selectedImages.length === 1) {
        await downloadSingleImage(selectedImages[0]);
      } else {
        await downloadMultipleImagesAsZip(selectedImages);
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadSingleImage = async (image) => {
    try {
      const response = await fetch(image.cloudinaryUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jewelry-${image.styleUsed}-${image.sizeUsed}.jpg`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading single image:", error);
      throw error;
    }
  };

  const downloadMultipleImagesAsZip = async (images) => {
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      const downloadPromises = images.map(async (image, index) => {
        try {
          const response = await fetch(image.cloudinaryUrl);
          const blob = await response.blob();
          const fileName = `jewelry-${image.styleUsed}-${image.sizeUsed}-${
            index + 1
          }.jpg`;
          zip.file(fileName, blob);
        } catch (error) {
          console.error(`Error downloading image ${index + 1}:`, error);
        }
      });

      await Promise.all(downloadPromises);

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jewelry-gallery-${images.length}-images.zip`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      throw error;
    }
  };

  const getDownloadButtonText = () => {
    if (isDownloading) {
      return selectedCount > 1 ? "Creating ZIP..." : "Downloading...";
    }
    return selectedCount > 1
      ? `Download ${selectedCount} images (ZIP)`
      : "Download (1 image)";
  };

  const isProcessing = isDeleting;

  // Solo mostrar si hay imágenes seleccionadas
  if (selectedCount === 0) return null;

  return (
    <div className="border-b border-border pb-6">
      <div className="flex justify-between items-end">
        <div className="flex gap-2 flex-wrap">
          {/* Download Button */}
          <Button
            variant="outline"
            onClick={handleBatchDownload}
            disabled={isDownloading || isProcessing}
          >
            <Download className="w-4 h-4 mr-2" />
            {getDownloadButtonText()}
          </Button>

          {/* Delete Button */}
          <Button
            variant="destructive"
            onClick={onDeleteSelected}
            disabled={isDeleting || isDownloading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Deleting..." : `Delete ${selectedCount} Selected`}
          </Button>
        </div>
      </div>

      {/* Status Information */}
      <div className="mt-4">
        <div className="text-sm text-muted-foreground">
          {selectedCount} of {totalCount} images selected
          {isProcessing && (
            <span className="ml-2 text-primary">• Deleting images...</span>
          )}
        </div>
      </div>
    </div>
  );
}
