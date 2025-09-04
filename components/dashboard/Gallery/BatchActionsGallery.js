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
      ? `Download ${selectedCount} images`
      : "Download image";
  };

  const getDownloadButtonTextMobile = () => {
    if (isDownloading) {
      return selectedCount > 1 ? "Creating..." : "Loading...";
    }
    return "Download";
  };

  const getDeleteButtonText = () => {
    if (isDeleting) return "Deleting...";
    return `Delete ${selectedCount} Selected`;
  };

  const getDeleteButtonTextMobile = () => {
    if (isDeleting) return "Deleting...";
    return "Delete";
  };

  const isProcessing = isDeleting;

  if (selectedCount === 0) return null;

  return (
    <div className="border-b border-border pb-4 sm:pb-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-end sm:space-y-0">
        {/* Action Buttons - Responsive Layout */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:gap-3 sm:space-y-0">
          {/* Download Button */}
          <Button
            variant="outline"
            onClick={handleBatchDownload}
            disabled={isDownloading || isProcessing}
            className="w-full sm:w-auto justify-center sm:justify-start"
          >
            <Download className="w-4 h-4 mr-2" />
            {/* Text changes based on screen size */}
            <span className="sm:hidden">{getDownloadButtonTextMobile()}</span>
            <span className="hidden sm:inline">{getDownloadButtonText()}</span>
            {selectedCount > 1 && (
              <span className="hidden sm:inline ml-1">(ZIP)</span>
            )}
          </Button>

          {/* Delete Button */}
          <Button
            variant="destructive"
            onClick={onDeleteSelected}
            disabled={isDeleting || isDownloading}
            className="w-full sm:w-auto justify-center sm:justify-start"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {/* Text changes based on screen size */}
            <span className="sm:hidden">{getDeleteButtonTextMobile()}</span>
            <span className="hidden sm:inline">{getDeleteButtonText()}</span>
          </Button>
        </div>

        {/* Status Information - Hidden on mobile when processing */}
        <div className={`${isProcessing ? "hidden sm:block" : ""}`}>
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
            {selectedCount} of {totalCount} images selected
          </div>
        </div>
      </div>

      {/* Processing Status - Mobile Only */}
      {isProcessing && (
        <div className="mt-3 sm:hidden">
          <div className="text-sm text-center text-primary">
            • Processing images...
          </div>
        </div>
      )}

      {/* Additional Status Info for Mobile */}
      <div className="mt-2 sm:hidden">
        <div className="text-xs text-center text-muted-foreground">
          {selectedCount} image{selectedCount > 1 ? "s" : ""} selected
        </div>
      </div>
    </div>
  );
}
