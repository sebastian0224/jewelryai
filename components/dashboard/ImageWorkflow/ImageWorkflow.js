"use client";

import { Progress } from "@/components/ui/progress";
import { useWorkflow } from "./WorkflowContext";

import { UploadSection } from "./UploadSection/UploadSection";
import { StyleSection } from "./StyleSection/StyleSection";
import { SizeSection } from "./SizeSection/SizeSection";
import { GenerateSection } from "./GenerateSection/GenerateSection";

// Step configuration for the wizard
const steps = [
  { id: 1, title: "Upload" },
  { id: 2, title: "Style" },
  { id: 3, title: "Size" },
  { id: 4, title: "Generate" },
];

export function ImageWorkflow() {
  const { currentStep } = useWorkflow();

  // Calculate progress percentage based on current step
  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Progress Stepper */}
      <div className="space-y-4">
        <Progress value={progressValue} className="w-full h-2" />

        {/* Step indicators */}
        <div className="flex justify-between items-center">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center space-y-2 ${
                step.id <= currentStep
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  step.id < currentStep
                    ? "bg-primary text-primary-foreground border-primary"
                    : step.id === currentStep
                    ? "border-primary text-primary bg-background"
                    : "border-muted-foreground text-muted-foreground bg-background"
                }`}
              >
                {step.id < currentStep ? "✓" : step.id}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{step.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && <UploadSection />}
        {currentStep === 2 && <StyleSection />}
        {currentStep === 3 && <SizeSection />}
        {currentStep === 4 && <GenerateSection />}
      </div>
    </div>
  );
}
