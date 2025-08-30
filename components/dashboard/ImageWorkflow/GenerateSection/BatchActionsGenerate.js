"use client";

import { Button } from "@/components/ui/button";
import { Download, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  saveSelectedImagesAction,
  discardAllImagesAction,
} from "@/lib/actions/save-discard-actions";

export function BatchActionsGenerate({
  selectedCount,
  totalCount,
  onSelectAll,
  selectedImages,
  isTemporary = false,
  userId,
  originalImagePublicId,
  onImagesProcessed,
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

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

  const handleSaveSelected = async () => {
    if (selectedImages.length === 0 || !userId) return;

    setIsSaving(true);
    try {
      const imageIds = selectedImages.map((img) => img.id);
      const result = await saveSelectedImagesAction(
        imageIds,
        userId,
        originalImagePublicId
      );

      if (result.success) {
        console.log(
          `Saved ${result.savedCount} images, discarded ${result.discardedCount} temporary images`
        );
        onImagesProcessed && onImagesProcessed("saved", result);
      } else {
        console.error("Save failed:", result.error);
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardAll = async () => {
    if (!userId) return;

    setIsDiscarding(true);
    try {
      const result = await discardAllImagesAction(
        userId,
        originalImagePublicId
      );

      if (result.success) {
        console.log(`Discarded ${result.discardedCount} temporary images`);
        onImagesProcessed && onImagesProcessed("discarded", result);
      } else {
        console.error("Discard failed:", result.error);
      }
    } catch (error) {
      console.error("Discard failed:", error);
    } finally {
      setIsDiscarding(false);
    }
  };

  const downloadSingleImage = async (image) => {
    try {
      const imageUrl = image.cloudinaryUrl || image.imageUrl;
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jewelry-${image.background || image.styleUsed}-${
        image.size || image.sizeUsed
      }.jpg`;
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
          const imageUrl = image.cloudinaryUrl || image.imageUrl;
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const fileName = `jewelry-${image.background || image.styleUsed}-${
            image.size || image.sizeUsed
          }-${index + 1}.jpg`;
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
    return selectedCount > 1
      ? `Download ${selectedCount} images (ZIP)`
      : "Download (1 image)";
  };

  const isProcessing = isSaving || isDiscarding;

  return (
    <div className="border-b border-border pb-6">
      <div className="flex justify-between items-end">
        {totalCount > 0 && (
          <div className="flex gap-2 flex-wrap">
            {/* Select All - Solo para Generate Section */}
            <Button
              variant="outline"
              onClick={onSelectAll}
              disabled={isProcessing || isDownloading}
            >
              {selectedCount === totalCount ? "Deselect All" : "Select All"}
            </Button>

            {selectedCount > 0 && (
              <>
                {/* Download Button */}
                <Button
                  variant="outline"
                  onClick={handleBatchDownload}
                  disabled={isDownloading || isProcessing}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {getDownloadButtonText()}
                </Button>

                {/* Save Button - Solo para temporales */}
                {isTemporary && (
                  <Button
                    onClick={handleSaveSelected}
                    disabled={isSaving || isProcessing}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : `Save ${selectedCount} Selected`}
                  </Button>
                )}
              </>
            )}

            {/* Discard All Button - Solo para temporales */}
            {isTemporary && (
              <Button
                variant="destructive"
                onClick={handleDiscardAll}
                disabled={isDiscarding || isProcessing}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDiscarding ? "Discarding..." : "Discard All"}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Status Information */}
      <div className="mt-4 space-y-1">
        {selectedCount > 0 && (
          <div className="text-sm text-muted-foreground">
            {selectedCount} of {totalCount} images selected
            {isProcessing && (
              <span className="ml-2 text-primary">
                •{" "}
                {isSaving
                  ? "Saving selected images..."
                  : "Discarding images..."}
              </span>
            )}
          </div>
        )}

        {isTemporary && !isProcessing && (
          <div className="text-xs text-orange-600 dark:text-orange-400">
            These are temporary images. Save the ones you want to keep or they
            will be automatically deleted.
          </div>
        )}
      </div>
    </div>
  );
}
