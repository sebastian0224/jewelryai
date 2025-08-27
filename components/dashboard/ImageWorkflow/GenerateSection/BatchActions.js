"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

export function BatchActions({
  selectedCount,
  totalCount,
  onSelectAll,
  selectedImages,
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleBatchDownload = async () => {
    if (selectedImages.length === 0) return;

    setIsDownloading(true);
    try {
      if (selectedImages.length === 1) {
        // Descarga individual
        await downloadSingleImage(selectedImages[0]);
      } else {
        // Descarga múltiple como ZIP
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
      console.error("Error downloading single image:", error);
      throw error;
    }
  };

  const downloadMultipleImagesAsZip = async (images) => {
    try {
      // Importar JSZip dinámicamente
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Descargar todas las imágenes y agregarlas al ZIP
      const downloadPromises = images.map(async (image, index) => {
        try {
          const response = await fetch(image.imageUrl);
          const blob = await response.blob();
          const fileName = `jewelry-${image.background}-${image.size}-${
            index + 1
          }.jpg`;
          zip.file(fileName, blob);
        } catch (error) {
          console.error(`Error downloading image ${index + 1}:`, error);
          // No interrumpir el proceso por una imagen fallida
        }
      });

      await Promise.all(downloadPromises);

      // Generar y descargar el ZIP
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jewelry-images-${images.length}-images.zip`;
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

    if (selectedCount > 1) {
      return `Download ${selectedCount} images (ZIP)`;
    }

    return "Download (1 image)";
  };

  return (
    <div className="border-b border-border pb-6">
      <div className="flex justify-between items-end">
        {totalCount > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onSelectAll}
              disabled={isDownloading}
            >
              {selectedCount === totalCount ? "Deselect All" : "Select All"}
            </Button>

            {selectedCount > 0 && (
              <Button onClick={handleBatchDownload} disabled={isDownloading}>
                <Download className="w-4 h-4 mr-2" />
                {getDownloadButtonText()}
              </Button>
            )}
          </div>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          {selectedCount} of {totalCount} images selected
          {isDownloading && (
            <span className="ml-2 text-primary">
              • {selectedCount > 1 ? "Preparing download..." : "Downloading..."}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
