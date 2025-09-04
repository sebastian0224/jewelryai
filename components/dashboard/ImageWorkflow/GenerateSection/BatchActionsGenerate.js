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
        onImagesProcessed && onImagesProcessed("saved", result);
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
        onImagesProcessed && onImagesProcessed("discarded", result);
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
      ? `Download ${selectedCount} images`
      : "Download image";
  };

  const isProcessing = isSaving || isDiscarding;

  return (
    <div className="bg-[#FAFAF7] border border-[#A8A8A8] rounded-xl p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        {totalCount > 0 && (
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={onSelectAll}
              disabled={isProcessing || isDownloading}
              className="bg-white border-[#A8A8A8] text-[#1A1A1A] hover:bg-[#F0F0F0] hover:border-[#C9A227] transition-all duration-200"
            >
              {selectedCount === totalCount ? "Deselect all" : "Select all"}
            </Button>

            {selectedCount > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={handleBatchDownload}
                  disabled={isDownloading || isProcessing}
                  className="bg-white border-[#A8A8A8] text-[#1A1A1A] hover:bg-[#F0F0F0] hover:border-[#C9A227] transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {getDownloadButtonText()}
                </Button>

                {isTemporary && (
                  <Button
                    onClick={handleSaveSelected}
                    disabled={isSaving || isProcessing}
                    className="bg-[#C9A227] text-white hover:bg-[#B8921F] border-0 transition-all duration-200"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : `Save ${selectedCount} selected`}
                  </Button>
                )}
              </>
            )}

            {isTemporary && (
              <Button
                variant="destructive"
                onClick={handleDiscardAll}
                disabled={isDiscarding || isProcessing}
                className="bg-[#8C1C13] text-white hover:bg-[#7A1810] border-0 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDiscarding ? "Discarding..." : "Discard all"}
              </Button>
            )}
          </div>
        )}
      </div>

      {(selectedCount > 0 || isTemporary) && (
        <div className="mt-4 space-y-2">
          {selectedCount > 0 && (
            <div className="text-sm text-[#4D4D4D] font-medium">
              {selectedCount} of {totalCount} images selected
              {isProcessing && (
                <span className="ml-2 text-[#155E63]">
                  •{" "}
                  {isSaving
                    ? "Saving selected images..."
                    : "Discarding images..."}
                </span>
              )}
            </div>
          )}

          {isTemporary && !isProcessing && (
            <div className="text-xs text-[#C9A227] bg-[#C9A227]/10 px-3 py-2 rounded-lg border border-[#C9A227]/20">
              These are temporary images. Save the ones you want to keep or they
              will be automatically deleted.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
