"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Crown } from "lucide-react";
import { useWorkflow } from "../WorkflowContext";

import { CloudinaryUploadButton } from "./CloudinaryUploadButton";
import { ImagePreview } from "./ImagePreview";

export function UploadSection() {
  const {
    uploadedImage,
    handleSetUploadedImage,
    nextStep,
    canGoToStep,

    usageStatus,
    usageInfo,
    usageError,
    loadUsageInfo,
  } = useWorkflow();

  const handleUploadSuccess = (imageUrl) => {
    handleSetUploadedImage(imageUrl);
  };

  const handleNext = () => {
    if (canGoToStep(2)) {
      nextStep();
    }
  };

  // Loading state
  if (usageStatus === "loading") {
    return (
      <Card className="bg-[#FAFAF7] border-[#A8A8A8] shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-serif text-[#1A1A1A]">
            Upload Your Jewelry Image
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#A8A8A8] border-t-[#C9A227]"></div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (usageError) {
    return (
      <Card className="bg-[#FAFAF7] border-[#A8A8A8] shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-serif text-[#1A1A1A]">
            Upload Your Jewelry Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert
            variant="destructive"
            className="bg-[#8C1C13]/10 border-[#8C1C13] text-[#8C1C13]"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{usageError}</AlertDescription>
          </Alert>
          <Button
            onClick={loadUsageInfo}
            variant="outline"
            className="w-full border-[#A8A8A8] text-[#4D4D4D] hover:bg-[#F0F0F0] hover:text-[#1A1A1A] transition-all duration-200 bg-transparent"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Limit reached state
  if (usageStatus === "limit_reached" && usageInfo) {
    return (
      <Card className="bg-[#FAFAF7] border-[#A8A8A8] shadow-lg">
        <CardHeader className="pb-4 text-center">
          <CardTitle className="text-xl font-serif text-[#1A1A1A]">
            Usage Limit Reached
          </CardTitle>
          <p className="text-[#4D4D4D] mt-2">
            {usageInfo.plan === "free"
              ? "You've used all your free generations for this month"
              : "You've reached your monthly generation limit"}
          </p>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          {usageInfo.plan === "free" ? (
            <Button
              size="lg"
              disabled
              className="bg-[#C9A227] hover:bg-[#C9A227]/90 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          ) : (
            <p className="text-sm text-[#4D4D4D] text-center">
              Usage resets in {usageInfo.daysUntilReset} days
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Normal upload flow
  return (
    <Card className="bg-[#FAFAF7] border-[#A8A8A8] shadow-lg max-w-2xl mx-auto">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-xl md:text-2xl font-serif text-[#1A1A1A]">
          Upload Your Jewelry Image
        </CardTitle>
        <p className="text-[#4D4D4D] mt-2 text-sm md:text-base">
          Select a high-quality image of your jewelry piece
        </p>
      </CardHeader>
      <CardContent className="space-y-6 px-4 md:px-6">
        <div className="flex justify-center">
          <CloudinaryUploadButton onUploadSuccess={handleUploadSuccess} />
        </div>

        {uploadedImage && (
          <div className="space-y-6">
            <ImagePreview imageUrl={uploadedImage} />
            <div className="flex justify-center md:justify-end">
              <Button
                onClick={handleNext}
                className="bg-[#C9A227] hover:bg-[#C9A227]/90 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 w-full md:w-auto"
              >
                Continue to Style
              </Button>
            </div>
          </div>
        )}

        {!uploadedImage && (
          <div className="text-center py-8 px-4">
            <p className="text-[#4D4D4D] text-sm md:text-base">
              Upload an image to continue to the next step
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
