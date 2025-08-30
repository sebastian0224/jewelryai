"use client";

import { createContext, useContext, useState } from "react";
import { generateImagesAction } from "@/lib/actions/generate-images";
import { useUser } from "@clerk/nextjs";

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
  const { user } = useUser();

  // Estados principales del workflow
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // NUEVO: Estado para tracking de imagen original
  const [originalImagePublicId, setOriginalImagePublicId] = useState(null);

  // Estados de generación
  const [generationState, setGenerationState] = useState("ready"); // ready, generating, results, error
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  // Estado para manejar imágenes temporales
  const [isTemporary, setIsTemporary] = useState(false);

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función helper para extraer public_id de URL de Cloudinary
  const extractPublicIdFromUrl = (cloudinaryUrl) => {
    try {
      // Ejemplo: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/folder/public_id.jpg
      const urlParts = cloudinaryUrl.split("/");
      const uploadIndex = urlParts.indexOf("upload");
      if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
        // Tomar desde después de la versión hasta el final (sin extensión)
        let publicIdWithFolder = urlParts.slice(uploadIndex + 2).join("/");
        // Remover extensión si existe
        publicIdWithFolder = publicIdWithFolder.replace(/\.[^/.]+$/, "");
        return publicIdWithFolder;
      }
      return null;
    } catch (error) {
      console.error("Error extracting public_id from URL:", error);
      return null;
    }
  };

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
    setOriginalImagePublicId(null); // NUEVO: resetear public_id
    setSelectedStyle(null);
    setSelectedSize(null);
    setGenerationState("ready");
    setGeneratedImages([]);
    setSelectedImages([]);
    setIsTemporary(false);
    setIsLoading(false);
    setError(null);
  };

  // NUEVO: Función actualizada para setear imagen subida
  const handleSetUploadedImage = (imageData) => {
    setUploadedImage(imageData);

    // Extraer y guardar el public_id si es una URL de Cloudinary
    if (typeof imageData === "string" && imageData.includes("cloudinary.com")) {
      const publicId = extractPublicIdFromUrl(imageData);
      setOriginalImagePublicId(publicId);
      console.log("Original image public_id extracted:", publicId);
    } else if (imageData && imageData.public_id) {
      // Si el imageData ya viene con public_id
      setOriginalImagePublicId(imageData.public_id);
      console.log("Original image public_id from data:", imageData.public_id);
    }
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

  const generateImages = async () => {
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    if (!uploadedImage || !selectedStyle || !selectedSize) {
      setError("Missing required data for generation");
      return;
    }

    try {
      setGenerationState("generating");
      setError(null);
      const result = await generateImagesAction(
        uploadedImage,
        selectedStyle,
        selectedSize,
        user.id,
        originalImagePublicId
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      setGeneratedImages(result.images);
      // Auto-seleccionar todas las imágenes generadas
      setSelectedImages(result.images.map((img) => img.id));
      setIsTemporary(result.isTemporary || false);
      setGenerationState("results");

      console.log(
        `Successfully processed ${result.processedCount} images${
          result.isTemporary ? " (temporary)" : ""
        } - All images auto-selected`
      );
    } catch (error) {
      console.error("Generation error:", error);
      setError(error.message || "Failed to generate images");
      setGenerationState("error");
    }
  };

  // Función para manejar el callback de save/discard
  const handleImagesProcessed = (action, result) => {
    if (action === "saved") {
      console.log(
        `Images saved successfully: ${result.savedCount} saved, ${result.discardedCount} discarded`
      );
      // Resetear workflow después de guardar
      resetWorkflow();
    } else if (action === "discarded") {
      console.log(`All images discarded: ${result.discardedCount} discarded`);
      // Resetear workflow después de descartar
      resetWorkflow();
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
    originalImagePublicId, // NUEVO

    // Estados de generación
    generationState,
    generatedImages,
    selectedImages,
    isTemporary,

    // User info
    userId: user?.id,

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
    handleSetUploadedImage, // ACTUALIZADO: usar nueva función
    setSelectedStyle,
    setSelectedSize,
    setGenerationState,
    setGeneratedImages,
    setSelectedImages,
    setIsTemporary,
    setIsLoading,
    setError,

    // Funciones de generación
    generateImages,
    generateStylePrompt,

    // Funciones de selección de imágenes
    handleImageSelect,
    selectAllImages,

    // Función para manejar save/discard
    handleImagesProcessed,

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
