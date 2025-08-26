"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkflow } from "../WorkflowContext";

// Background style options
const backgroundOptions = [
  {
    id: "luxury-gold",
    name: "Luxury Gold",
    description: "Elegant gold gradient background",
    preview: "linear-gradient(135deg, #FFD700, #FFA500)",
  },
  {
    id: "marble-white",
    name: "White Marble",
    description: "Clean marble texture",
    preview: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
  },
  {
    id: "velvet-black",
    name: "Velvet Black",
    description: "Premium black velvet look",
    preview: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    description: "Warm rose gold finish",
    preview: "linear-gradient(135deg, #E8B4B8, #D4A574)",
  },
  {
    id: "crystal-clear",
    name: "Crystal Clear",
    description: "Transparent with subtle shine",
    preview:
      "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))",
  },
  {
    id: "sapphire-blue",
    name: "Sapphire Blue",
    description: "Deep blue luxury background",
    preview: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
  },
];

function BackgroundSelector({ selectedBackground, onBackgroundSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {backgroundOptions.map((option) => (
        <Card
          key={option.id}
          className={`cursor-pointer transition-all hover:scale-105 ${
            selectedBackground === option.id
              ? "ring-2 ring-primary shadow-lg"
              : "hover:shadow-md"
          }`}
          onClick={() => onBackgroundSelect(option.id, option)}
        >
          <CardContent className="p-4 space-y-3">
            {/* Preview */}
            <div
              className="w-full h-20 rounded-lg border"
              style={{ background: option.preview }}
            />

            {/* Info */}
            <div className="space-y-1">
              <h4 className="font-medium text-sm">{option.name}</h4>
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StyleSection() {
  const { selectedStyle, setSelectedStyle, nextStep, prevStep, canGoToStep } =
    useWorkflow();

  const handleStyleSelect = (styleId, styleData) => {
    // Guardamos tanto el ID como toda la data del estilo
    setSelectedStyle({
      id: styleId,
      ...backgroundOptions.find((option) => option.id === styleId),
    });
  };

  const handleNext = () => {
    if (canGoToStep(3)) {
      nextStep();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const canProceed = selectedStyle !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Choose Background Style</CardTitle>
        <p className="text-muted-foreground">
          Select the perfect background style for your jewelry
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Background Selector */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Background Options</h3>
          <BackgroundSelector
            selectedBackground={selectedStyle?.id}
            onBackgroundSelect={handleStyleSelect}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handleBack}>
            ← Back to Upload
          </Button>
          <Button onClick={handleNext} disabled={!canProceed} className="px-8">
            Continue to Size →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
