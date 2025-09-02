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
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Upload Your Jewelry Image</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-muted border-t-primary"></div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (usageError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Upload Your Jewelry Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{usageError}</AlertDescription>
          </Alert>
          <Button onClick={loadUsageInfo} variant="outline" className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Limit reached state
  if (usageStatus === "limit_reached" && usageInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Usage Limit Reached</CardTitle>
          <p className="text-muted-foreground">
            {usageInfo.plan === "free"
              ? "You've used all your free generations for this month"
              : "You've reached your monthly generation limit"}
          </p>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          {usageInfo.plan === "free" ? (
            <Button size="lg" disabled>
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Usage resets in {usageInfo.daysUntilReset} days
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Normal upload flow
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Upload Your Jewelry Image</CardTitle>
        <p className="text-muted-foreground">
          Select a high-quality image of your jewelry piece
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <CloudinaryUploadButton onUploadSuccess={handleUploadSuccess} />
        </div>

        {uploadedImage && (
          <div className="space-y-4">
            <ImagePreview imageUrl={uploadedImage} />
            <div className="flex justify-end">
              <Button onClick={handleNext} className="px-8">
                Continue to Style
              </Button>
            </div>
          </div>
        )}

        {!uploadedImage && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Upload an image to continue to the next step</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
