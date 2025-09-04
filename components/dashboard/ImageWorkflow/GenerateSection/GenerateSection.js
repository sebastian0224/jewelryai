"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWorkflow } from "../WorkflowContext";
import { GeneratedImageCard } from "./GeneratedImageCard";
import { BatchActionsGenerate } from "./BatchActionsGenerate";

export function GenerateSection() {
  const {
    selectedStyle,
    selectedSize,
    selectedImages,
    handleImageSelect,
    selectAllImages,
    generationState,
    generatedImages,
    error,
    generateImages,
    resetWorkflow,
    userId,
    originalImagePublicId,
    isTemporary,
    setGeneratedImages,
    setSelectedImages,
    setGenerationState,
  } = useWorkflow();

  const handleGenerate = async () => {
    await generateImages();
  };

  const handleStartNew = () => {
    resetWorkflow();
  };

  const getSelectedImagesData = () => {
    return selectedImages
      .map((id) => generatedImages.find((img) => img.id === id))
      .filter(Boolean);
  };

  const handleImagesProcessed = (action, result) => {
    if (action === "saved") {
      resetWorkflow();
    } else if (action === "discarded") {
      resetWorkflow();
    }
  };

  return (
    <Card className="bg-[#FAFAF7] border-[#A8A8A8] shadow-lg rounded-xl overflow-hidden p-0">
      <CardHeader className="bg-[#155E63] text-white">
        <CardTitle className="text-2xl font-serif text-[#FAFAF7]">
          {generationState === "ready" && "Ready to Generate"}
          {generationState === "generating" && "Generating AI Backgrounds"}
          {generationState === "results" &&
            (isTemporary ? "Review Your Results" : "Generated Results")}
          {generationState === "error" && "Generation Error"}
        </CardTitle>
        <p className="text-[#FAFAF7]/80 font-sans">
          {generationState === "ready" &&
            "Review your selections and generate AI backgrounds"}
          {generationState === "generating" &&
            "Processing your jewelry image with artificial intelligence"}
          {generationState === "results" &&
            isTemporary &&
            "Choose which images to save permanently to your gallery"}
          {generationState === "results" &&
            !isTemporary &&
            `Generated ${generatedImages.length} jewelry images with AI backgrounds`}
          {generationState === "error" &&
            "Something went wrong during generation"}
        </p>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-6 md:space-y-8">
        {generationState === "error" && (
          <Alert
            variant="destructive"
            className="bg-[#8C1C13]/10 border-[#8C1C13] text-[#8C1C13] rounded-lg"
          >
            <AlertDescription className="font-medium">
              {error ||
                "An error occurred during image generation. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {generationState === "ready" && (
          <>
            <div className="space-y-6">
              <h3 className="text-xl font-serif text-[#1A1A1A] text-center">
                Your Selections
              </h3>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-[#4D4D4D] uppercase tracking-wide">
                    Background Style
                  </h4>
                  <Card className="border-2 border-[#C9A227] bg-white shadow-md rounded-lg">
                    <CardContent className="p-4 md:p-6 space-y-4">
                      <div
                        className="w-full h-20 rounded-lg border border-[#A8A8A8]"
                        style={{ background: selectedStyle.preview }}
                      />
                      <div className="text-center">
                        <h5 className="font-serif font-semibold text-[#1A1A1A]">
                          {selectedStyle.name}
                        </h5>
                        <p className="text-sm text-[#4D4D4D] mt-1">
                          {selectedStyle.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-[#4D4D4D] uppercase tracking-wide">
                    Output Format
                  </h4>
                  <Card className="border-2 border-[#C9A227] bg-white shadow-md rounded-lg">
                    <CardContent className="p-4 md:p-6 space-y-4">
                      <div className="flex justify-center">
                        <div className="w-16 h-16 bg-[#F0F0F0] border border-[#A8A8A8] rounded-lg" />
                      </div>
                      <div className="text-center">
                        <h5 className="font-serif font-semibold text-[#1A1A1A]">
                          {selectedSize.name}
                        </h5>
                        <p className="text-sm text-[#4D4D4D]">
                          {selectedSize.dimensions}
                        </p>
                        <p className="text-xs text-[#4D4D4D]">
                          {selectedSize.ratio}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="text-center space-y-6 py-6 md:py-8">
              <div className="text-[#4D4D4D] font-medium">
                Ready to process your image with AI
              </div>
              <Button
                onClick={handleGenerate}
                size="lg"
                className="px-12 md:px-16 py-4 md:py-6 text-base md:text-lg font-serif bg-[#C9A227] hover:bg-[#B8921F] text-white border-0 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                Generate AI Backgrounds
              </Button>
            </div>
          </>
        )}

        {generationState === "generating" && (
          <div className="text-center space-y-8 py-12">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#F0F0F0] border-t-[#C9A227]"></div>
              </div>
              <div className="space-y-3">
                <p className="font-serif text-xl text-[#1A1A1A]">
                  Generating AI Backgrounds...
                </p>
                <p className="text-[#4D4D4D]">
                  Creating 4 variations with your selected style
                </p>
              </div>
            </div>
          </div>
        )}

        {generationState === "results" && generatedImages.length > 0 && (
          <div className="space-y-6 md:space-y-8">
            <BatchActionsGenerate
              selectedCount={selectedImages.length}
              totalCount={generatedImages.length}
              onSelectAll={selectAllImages}
              selectedImages={getSelectedImagesData()}
              isTemporary={isTemporary}
              userId={userId}
              originalImagePublicId={originalImagePublicId}
              onImagesProcessed={handleImagesProcessed}
            />

            <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2">
              {generatedImages.map((result) => (
                <GeneratedImageCard
                  key={result.id}
                  image={result}
                  isSelected={selectedImages.includes(result.id)}
                  onSelect={(isSelected) =>
                    handleImageSelect(result.id, isSelected)
                  }
                />
              ))}
            </div>
          </div>
        )}

        {generationState === "results" && generatedImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#4D4D4D] text-lg">
              No images were generated. Please try again.
            </p>
            <Button
              onClick={handleStartNew}
              variant="outline"
              className="mt-6 bg-white border-[#A8A8A8] text-[#1A1A1A] hover:bg-[#F0F0F0] hover:border-[#C9A227]"
            >
              Try Again
            </Button>
          </div>
        )}

        {(generationState === "results" || generationState === "error") && (
          <div className="flex justify-center pt-6 md:pt-8">
            <Button
              onClick={handleStartNew}
              variant="outline"
              className="bg-white border-[#A8A8A8] text-[#1A1A1A] hover:bg-[#F0F0F0] hover:border-[#C9A227] px-6 md:px-8 py-2 md:py-3 rounded-lg"
            >
              Start New Generation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
