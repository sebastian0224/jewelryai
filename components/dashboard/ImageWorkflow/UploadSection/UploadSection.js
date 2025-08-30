"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkflow } from "../WorkflowContext";

import { CloudinaryUploadButton } from "./CloudinaryUploadButton";
import { ImagePreview } from "./ImagePreview";

export function UploadSection() {
  const { uploadedImage, handleSetUploadedImage, nextStep, canGoToStep } =
    useWorkflow();

  const handleUploadSuccess = (imageUrl) => {
    handleSetUploadedImage(imageUrl);
  };

  const handleNext = () => {
    if (canGoToStep(2)) {
      nextStep();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Upload Your Jewelry Image</CardTitle>
        <p className="text-muted-foreground">
          Select a high-quality image of your jewelry piece
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Button */}
        <div className="flex justify-center">
          <CloudinaryUploadButton onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Image Preview */}
        {uploadedImage && (
          <div className="space-y-4">
            <ImagePreview imageUrl={uploadedImage} />

            {/* Next Button */}
            <div className="flex justify-end">
              <Button onClick={handleNext} className="px-8">
                Continue to Style
              </Button>
            </div>
          </div>
        )}

        {/* Instructions when no image uploaded */}
        {!uploadedImage && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Upload an image to continue to the next step</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
