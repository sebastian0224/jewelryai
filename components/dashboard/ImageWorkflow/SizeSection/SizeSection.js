"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkflow } from "../WorkflowContext";

// Size format options - Lista simplificada
const sizeOptions = [
  {
    id: "instagram-post",
    name: "Instagram Post",
    dimensions: "1080 × 1080",
    width: 1080,
    height: 1080,
    ratio: "1:1",
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    dimensions: "1080 × 1920",
    width: 1080,
    height: 1920,
    ratio: "9:16",
  },
  {
    id: "facebook-post",
    name: "Facebook Post",
    dimensions: "1200 × 630",
    width: 1200,
    height: 630,
    ratio: "1.91:1",
  },
  {
    id: "high-res",
    name: "High Resolution",
    dimensions: "2000 × 2000",
    width: 2000,
    height: 2000,
    ratio: "1:1",
  },
];

function SizeSelector({ selectedSize, onSizeSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {sizeOptions.map((option) => (
        <Card
          key={option.id}
          className={`cursor-pointer transition-all hover:scale-105 ${
            selectedSize === option.id
              ? "ring-2 ring-primary shadow-lg"
              : "hover:shadow-md"
          }`}
          onClick={() => onSizeSelect(option.id, option)}
        >
          <CardContent className="p-3 text-center space-y-2">
            {/* Visual representation of aspect ratio */}
            <div className="flex justify-center">
              <div
                className={`bg-muted border rounded ${
                  option.ratio === "1:1"
                    ? "w-8 h-8"
                    : option.ratio === "9:16"
                    ? "w-4 h-8"
                    : "w-8 h-4" // default for 1.91:1
                }`}
              />
            </div>

            {/* Info */}
            <div className="space-y-1">
              <h4 className="font-medium text-xs">{option.name}</h4>
              <p className="text-xs text-muted-foreground">
                {option.dimensions}
              </p>
              <p className="text-xs text-muted-foreground">{option.ratio}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SizeSection() {
  const { selectedSize, setSelectedSize, nextStep, prevStep, canGoToStep } =
    useWorkflow();

  const handleSizeSelect = (sizeId, sizeData) => {
    // Guardamos tanto el ID como toda la data del tamaño
    setSelectedSize({
      id: sizeId,
      ...sizeOptions.find((option) => option.id === sizeId),
    });
  };

  const handleNext = () => {
    if (canGoToStep(4)) {
      nextStep();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const canProceed = selectedSize !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Choose Output Format</CardTitle>
        <p className="text-muted-foreground">
          Select the dimensions and format for your final image
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Size Selector */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Formats</h3>
          <SizeSelector
            selectedSize={selectedSize?.id}
            onSizeSelect={handleSizeSelect}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handleBack}>
            ← Back to Style
          </Button>
          <Button onClick={handleNext} disabled={!canProceed} className="px-8">
            Continue to Generate →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
