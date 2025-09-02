"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { generateImagesAction } from "@/lib/actions/generate-images";
import { getUserUsage } from "@/lib/actions/usage-manager";
import { useUser } from "@clerk/nextjs";

const WorkflowContext = createContext(undefined);

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
}

//---------------

// Proveedor del contexto
export function WorkflowProvider({ children }) {
  const { user } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [originalImagePublicId, setOriginalImagePublicId] = useState(null);

  // Estados de generación
  const [generationState, setGenerationState] = useState("ready"); // ready, generating, results, error, usage_limit
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isTemporary, setIsTemporary] = useState(false);

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados centralizados de usage
  const [usageStatus, setUsageStatus] = useState("loading"); // loading, available, limit_reached
  const [usageInfo, setUsageInfo] = useState(null);
  const [usageError, setUsageError] = useState(null);

  // Función helper para extraer public_id de URL de Cloudinary
  const extractPublicIdFromUrl = (cloudinaryUrl) => {
    try {
      const urlParts = cloudinaryUrl.split("/");
      const uploadIndex = urlParts.indexOf("upload");
      if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
        let publicIdWithFolder = urlParts.slice(uploadIndex + 2).join("/");
        publicIdWithFolder = publicIdWithFolder.replace(/\.[^/.]+$/, "");
        return publicIdWithFolder;
      }
      return null;
    } catch (error) {
      console.error("Error extracting public_id from URL:", error);
      return null;
    }
  };

  // NUEVO: Cargar usage info al inicializar o cambiar usuario
  useEffect(() => {
    if (user?.id) {
      loadUsageInfo();
    } else {
      // Reset usage info if no user
      setUsageStatus("loading");
      setUsageInfo(null);
      setUsageError(null);
    }
  }, [user?.id]);

  // NUEVO: Función para cargar información de usage
  const loadUsageInfo = async () => {
    if (!user?.id) return;

    setUsageStatus("loading");
    setUsageError(null);

    try {
      const result = await getUserUsage(user.id);

      if (result.success) {
        setUsageInfo(result.data);
        setUsageStatus(result.data.isAtLimit ? "limit_reached" : "available");
      } else {
        setUsageError(result.error);
        setUsageStatus("available"); // Fallback: permitir uso si hay error de carga
      }
    } catch (error) {
      console.error("Error loading usage info:", error);
      setUsageError("Failed to load usage information");
      setUsageStatus("available"); // Fallback: permitir uso si hay error
    }
  };

  // NUEVO: Función para refrescar usage después de generar
  const refreshUsageInfo = async () => {
    if (user?.id) {
      await loadUsageInfo();
    }
  };

  // Función actualizada para setear imagen subida
  const handleSetUploadedImage = (imageData) => {
    setUploadedImage(imageData);

    // Extraer y guardar el public_id si es una URL de Cloudinary
    if (typeof imageData === "string" && imageData.includes("cloudinary.com")) {
      const publicId = extractPublicIdFromUrl(imageData);
      setOriginalImagePublicId(publicId);
      console.log("Original image public_id extracted:", publicId);
    } else if (imageData && imageData.public_id) {
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
      setSelectedImages([]);
    } else {
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
      setSelectedImages(result.images.map((img) => img.id));
      setIsTemporary(result.isTemporary || false);
      setGenerationState("results");

      // Refrescar usage info después de generar exitosamente
      await refreshUsageInfo();

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
  const handleImagesProcessed = async (action, result) => {
    if (action === "saved") {
      console.log(
        `Images saved successfully: ${result.savedCount} saved, ${result.discardedCount} discarded`
      );
      await refreshUsageInfo(); // Refrescar usage después de guardar
      resetWorkflow();
    } else if (action === "discarded") {
      console.log(`All images discarded: ${result.discardedCount} discarded`);
      resetWorkflow();
    }
  };

  // Funciones helper
  const resetWorkflow = () => {
    setCurrentStep(1);
    setUploadedImage(null);
    setOriginalImagePublicId(null);
    setSelectedStyle(null);
    setSelectedSize(null);
    setGenerationState("ready");
    setGeneratedImages([]);
    setSelectedImages([]);
    setIsTemporary(false);
    setIsLoading(false);
    setError(null);
    // NO resetear usage info - mantenerlo actualizado
    if (user?.id) {
      loadUsageInfo(); // Refrescar usage
    }
  };
  const goToStep = (step) => {
    setCurrentStep(step);
  };
  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const canGoToStep = (step) => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return uploadedImage !== null && usageStatus === "available";
      case 3:
        return (
          uploadedImage !== null &&
          selectedStyle !== null &&
          usageStatus === "available"
        );
      case 4:
        return (
          uploadedImage !== null &&
          selectedStyle !== null &&
          selectedSize !== null &&
          usageStatus === "available"
        );
      default:
        return false;
    }
  };
  const getProgress = () => {
    return ((currentStep - 1) / 3) * 100;
  };

  // Valor del contexto que se pasará a los componentes
  const contextValue = {
    // Estados principales
    currentStep,
    uploadedImage,
    selectedStyle,
    selectedSize,
    originalImagePublicId,

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

    // NUEVO: Estados centralizados de usage
    usageStatus,
    usageInfo,
    usageError,

    // Funciones de navegación
    goToStep,
    nextStep,
    prevStep,
    resetWorkflow,

    // Funciones de datos
    setUploadedImage,
    handleSetUploadedImage,
    setSelectedStyle,
    setSelectedSize,
    setGenerationState,
    setGeneratedImages,
    setSelectedImages,
    setIsTemporary,
    setIsLoading,
    setError,

    // NUEVO: Funciones de usage
    loadUsageInfo,
    refreshUsageInfo,

    // Funciones de generación
    generateImages,

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
