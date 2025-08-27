"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWorkflow } from "../WorkflowContext";

import { GeneratedImageCard } from "./GeneratedImageCard";
import { BatchActions } from "./BatchActions";

export function GenerateSection() {
  const {
    // Estados del contexto
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
  } = useWorkflow();

  const handleGenerate = async () => {
    await generateImages();
  };

  const handleStartNew = () => {
    resetWorkflow();
  };

  // Obtener las imágenes seleccionadas con toda su información
  const getSelectedImagesData = () => {
    return selectedImages
      .map((id) => generatedImages.find((img) => img.id === id))
      .filter(Boolean);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {generationState === "ready" && "Ready to Generate"}
          {generationState === "generating" && "Generating AI Backgrounds"}
          {generationState === "results" && "Generated Results"}
          {generationState === "error" && "Generation Error"}
        </CardTitle>
        <p className="text-muted-foreground">
          {generationState === "ready" &&
            "Review your selections and generate AI backgrounds"}
          {generationState === "generating" &&
            "Processing your jewelry image with AI"}
          {generationState === "results" &&
            `Generated ${generatedImages.length} jewelry images with AI backgrounds`}
          {generationState === "error" &&
            "Something went wrong during generation"}
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Error State */}
        {generationState === "error" && (
          <Alert variant="destructive">
            <AlertDescription>
              {error ||
                "An error occurred during image generation. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Ready State - Show selections and generate button */}
        {generationState === "ready" && (
          <>
            {/* Selected Options Summary */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Your Selections</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Selected Style */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Background Style
                  </h4>
                  <Card className="ring-2 ring-primary/20">
                    <CardContent className="p-4 space-y-3">
                      <div
                        className="w-full h-16 rounded-lg border"
                        style={{ background: selectedStyle.preview }}
                      />
                      <div>
                        <h5 className="font-medium text-sm">
                          {selectedStyle.name}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {selectedStyle.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Selected Size */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Output Format
                  </h4>
                  <Card className="ring-2 ring-primary/20">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-center">
                        <div className="w-12 h-12 bg-muted border rounded" />
                      </div>
                      <div className="text-center">
                        <h5 className="font-medium text-sm">
                          {selectedSize.name}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {selectedSize.dimensions}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedSize.ratio}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="text-center space-y-4">
              <div className="text-muted-foreground">
                Ready to process your image with AI
              </div>
              <Button
                onClick={handleGenerate}
                size="lg"
                className="px-12 py-4 text-lg"
              >
                Generate AI Backgrounds
              </Button>
            </div>
          </>
        )}

        {/* Generating State - Loading simple */}
        {generationState === "generating" && (
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Main spinner */}
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-muted border-t-primary"></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Generating AI Backgrounds...</p>
              <p className="text-sm text-muted-foreground">
                Creating 4 variations with your selected style
              </p>
            </div>
          </div>
        )}

        {/* Results State - Show generated images grid */}
        {generationState === "results" && generatedImages.length > 0 && (
          <div className="space-y-8">
            {/* Batch Actions Header */}
            <BatchActions
              selectedCount={selectedImages.length}
              totalCount={generatedImages.length}
              onSelectAll={selectAllImages}
              selectedImages={getSelectedImagesData()}
            />

            {/* Results Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
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

        {/* Results State pero sin imágenes (error edge case) */}
        {generationState === "results" && generatedImages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No images were generated. Please try again.
            </p>
            <Button onClick={handleStartNew} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {(generationState === "results" || generationState === "error") && (
            <Button onClick={handleStartNew} variant="outline">
              Start New Generation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
