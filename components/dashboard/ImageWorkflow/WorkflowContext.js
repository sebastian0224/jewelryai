"use client";

import { createContext, useContext, useState } from "react";
import { changeBackgroundBria } from "@/lib/replicate";

// Crear el contexto
const WorkflowContext = createContext(undefined);

// Hook personalizado para usar el contexto
export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
}

// Función utilitaria para generar prompts por estilo
const generateStylePrompt = (selectedStyle) => {
  const stylePrompts = {
    "luxury-gold":
      "elegant gold background, luxury jewelry display, warm golden lighting, premium showcase, sophisticated ambiance",
    "marble-white":
      "clean white marble surface, minimalist jewelry showcase, soft lighting, elegant presentation, pristine background",
    "velvet-black":
      "premium black velvet background, dramatic jewelry lighting, luxury display, sophisticated dark ambiance",
    "rose-gold":
      "warm rose gold background, elegant jewelry presentation, soft pink metallic lighting, luxury showcase",
    "crystal-clear":
      "transparent crystal background with subtle shine, clean jewelry display, pristine lighting, minimalist elegance",
    "sapphire-blue":
      "deep blue luxury background, elegant jewelry showcase, sophisticated blue lighting, premium presentation",
  };

  return stylePrompts[selectedStyle.id] || stylePrompts["luxury-gold"];
};

// Proveedor del contexto
export function WorkflowProvider({ children }) {
  // Estados principales del workflow
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Estados de generación
  const [generationState, setGenerationState] = useState("ready"); // ready, generating, results, error
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  // Estados de UI (sin progreso detallado)
  // generationProgress eliminado - no necesario para una sola llamada

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funciones helper para manejar los estados
  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const resetWorkflow = () => {
    setCurrentStep(1);
    setUploadedImage(null);
    setSelectedStyle(null);
    setSelectedSize(null);
    setGenerationState("ready");
    setGeneratedImages([]);
    setSelectedImages([]);
    setIsLoading(false);
    setError(null);
  };

  const handleImageSelect = (imageId, isSelected) => {
    if (isSelected) {
      setSelectedImages((prev) => [...prev, imageId]);
    } else {
      setSelectedImages((prev) => prev.filter((id) => id !== imageId));
    }
  };

  const selectAllImages = () => {
    if (selectedImages.length === generatedImages.length) {
      // Si todos están seleccionados, deseleccionar todos
      setSelectedImages([]);
    } else {
      // Si no todos están seleccionados, seleccionar todos
      setSelectedImages(generatedImages.map((img) => img.id));
    }
  };

  // NUEVO: Función principal de generación de imágenes (simplificada)
  const generateImages = async () => {
    if (!uploadedImage || !selectedStyle || !selectedSize) {
      setError("Missing required data for generation");
      return;
    }

    try {
      setGenerationState("generating");
      setError(null);

      const stylePrompt = generateStylePrompt(selectedStyle);

      const result = await changeBackgroundBria(uploadedImage, stylePrompt);

      if (!result.success) {
        throw new Error(result.error || "Generation failed");
      }
      console.log(result);

      // Procesar los resultados (asumo que result.imageUrls es un array)
      const processedImages = result.imageUrls.map((imageUrl, index) => ({
        id: Date.now() + index, // ID único
        imageUrl: imageUrl,
        background: selectedStyle.name,
        size: selectedSize.name,
        prompt: stylePrompt,
        index: index + 1,
      }));

      setGeneratedImages(processedImages);
      setGenerationState("results");
    } catch (error) {
      console.error("Generation error:", error);
      setError(error.message || "Failed to generate images");
      setGenerationState("error");
    }
  };

  // Validaciones para navegación
  const canGoToStep = (step) => {
    switch (step) {
      case 1:
        return true; // Siempre puede ir al primer paso
      case 2:
        return uploadedImage !== null; // Necesita imagen subida
      case 3:
        return uploadedImage !== null && selectedStyle !== null; // Necesita imagen y estilo
      case 4:
        return (
          uploadedImage !== null &&
          selectedStyle !== null &&
          selectedSize !== null
        ); // Necesita todo
      default:
        return false;
    }
  };

  // Progreso del workflow (0-100)
  const getProgress = () => {
    return ((currentStep - 1) / 3) * 100; // 4 pasos total (índice 0-3)
  };

  // Valor del contexto que se pasará a los componentes
  const contextValue = {
    // Estados principales
    currentStep,
    uploadedImage,
    selectedStyle,
    selectedSize,

    // Estados de generación
    generationState,
    generatedImages,
    selectedImages,

    // Estados de UI
    isLoading,
    error,

    // Funciones de navegación
    goToStep,
    nextStep,
    prevStep,
    resetWorkflow,

    // Funciones de datos
    setUploadedImage,
    setSelectedStyle,
    setSelectedSize,
    setGenerationState,
    setGeneratedImages,
    setIsLoading,
    setError,

    // NUEVAS: Funciones de generación
    generateImages,
    generateStylePrompt,

    // Funciones de selección de imágenes
    handleImageSelect,
    selectAllImages,

    // Funciones de utilidad
    canGoToStep,
    getProgress,
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
}
