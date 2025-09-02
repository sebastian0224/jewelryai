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

// Proveedor del contexto
export function WorkflowProvider({ children }) {
  const { user } = useUser();

  // Estados principales del workflow
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [originalImagePublicId, setOriginalImagePublicId] = useState(null);

  // Estados de generación
  const [generationState, setGenerationState] = useState("ready");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isTemporary, setIsTemporary] = useState(false);

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados centralizados de usage
  const [usageStatus, setUsageStatus] = useState("loading");
  const [usageInfo, setUsageInfo] = useState(null);
  const [usageError, setUsageError] = useState(null);

  // Estado para controlar si ya se cargó desde localStorage
  const [isInitialized, setIsInitialized] = useState(false);

  // PERSISTENCE: Constantes
  const STORAGE_KEY = "jewelry-workflow";
  const STORAGE_VERSION = "1.0";
  const EXPIRY_HOURS = 24; // Expira después de 24 horas

  // PERSISTENCE: Función para guardar estado en localStorage
  const saveWorkflowState = () => {
    if (!isInitialized) return; // No guardar hasta que se haya inicializado

    const stateToSave = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      userId: user?.id || null,
      currentStep,
      uploadedImage,
      selectedStyle,
      selectedSize,
      originalImagePublicId,
      // Agregar estados de generación
      generationState,
      generatedImages,
      selectedImages,
      isTemporary,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      console.log("✅ Workflow state saved to localStorage");
    } catch (error) {
      console.warn("⚠️ Failed to save workflow state:", error);
    }
  };

  // PERSISTENCE: Función para cargar estado desde localStorage
  const loadWorkflowState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const parsedState = JSON.parse(saved);

      // Verificar versión
      if (parsedState.version !== STORAGE_VERSION) {
        console.log("🔄 Workflow version mismatch, clearing localStorage");
        clearWorkflowState();
        return null;
      }

      // Verificar expiración (24 horas)
      const now = Date.now();
      const age = now - parsedState.timestamp;
      const maxAge = EXPIRY_HOURS * 60 * 60 * 1000;

      if (age > maxAge) {
        console.log("⏰ Workflow state expired, clearing localStorage");
        clearWorkflowState();
        return null;
      }

      // Verificar que sea del mismo usuario
      if (user?.id && parsedState.userId && parsedState.userId !== user.id) {
        console.log("👤 Different user, clearing localStorage");
        clearWorkflowState();
        return null;
      }

      console.log("✅ Workflow state loaded from localStorage");
      return parsedState;
    } catch (error) {
      console.warn("⚠️ Failed to load workflow state:", error);
      clearWorkflowState();
      return null;
    }
  };

  // PERSISTENCE: Función para limpiar localStorage
  const clearWorkflowState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log("🧹 Workflow state cleared from localStorage");
    } catch (error) {
      console.warn("⚠️ Failed to clear workflow state:", error);
    }
  };

  // PERSISTENCE: Cargar estado al inicializar (solo una vez)
  useEffect(() => {
    if (user?.id && !isInitialized) {
      const savedState = loadWorkflowState();

      if (savedState) {
        // Restaurar estado guardado
        setCurrentStep(savedState.currentStep || 1);
        setUploadedImage(savedState.uploadedImage);
        setSelectedStyle(savedState.selectedStyle);
        setSelectedSize(savedState.selectedSize);
        setOriginalImagePublicId(savedState.originalImagePublicId);

        // Restaurar estados de generación
        if (savedState.generationState) {
          setGenerationState(savedState.generationState);
        }
        if (savedState.generatedImages) {
          setGeneratedImages(savedState.generatedImages);
        }
        if (savedState.selectedImages) {
          setSelectedImages(savedState.selectedImages);
        }
        if (savedState.isTemporary !== undefined) {
          setIsTemporary(savedState.isTemporary);
        }

        console.log(
          `🔄 Workflow restored to step ${savedState.currentStep} with generation state: ${savedState.generationState}`
        );
      }

      setIsInitialized(true);
    }
  }, [user?.id, isInitialized]);

  // PERSISTENCE: Auto-guardar cuando cambia el estado relevante
  useEffect(() => {
    if (isInitialized && user?.id) {
      saveWorkflowState();
    }
  }, [
    currentStep,
    uploadedImage,
    selectedStyle,
    selectedSize,
    originalImagePublicId,
    generationState,
    generatedImages,
    selectedImages,
    isTemporary,
    isInitialized,
    user?.id,
  ]);

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

  // Cargar usage info al inicializar o cambiar usuario
  useEffect(() => {
    if (user?.id) {
      loadUsageInfo();
    } else {
      setUsageStatus("loading");
      setUsageInfo(null);
      setUsageError(null);
    }
  }, [user?.id]);

  // Función para cargar información de usage
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
        setUsageStatus("available");
      }
    } catch (error) {
      console.error("Error loading usage info:", error);
      setUsageError("Failed to load usage information");
      setUsageStatus("available");
    }
  };

  // Función para refrescar usage después de generar
  const refreshUsageInfo = async () => {
    if (user?.id) {
      await loadUsageInfo();
    }
  };

  // Función actualizada para setear imagen subida
  const handleSetUploadedImage = (imageData) => {
    setUploadedImage(imageData);

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

  // PERSISTENCE: Función para manejar el callback de save/discard (limpia localStorage)
  const handleImagesProcessed = async (action, result) => {
    if (action === "saved") {
      console.log(
        `Images saved successfully: ${result.savedCount} saved, ${result.discardedCount} discarded`
      );
      await refreshUsageInfo();

      // LIMPIAR localStorage después de completar exitosamente
      clearWorkflowState();
      resetWorkflow();
    } else if (action === "discarded") {
      console.log(`All images discarded: ${result.discardedCount} discarded`);

      // LIMPIAR localStorage después de descartar
      clearWorkflowState();
      resetWorkflow();
    }
  };

  // PERSISTENCE: Función de reset actualizada (también limpia localStorage)
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

    // LIMPIAR localStorage cuando se resetea manualmente
    clearWorkflowState();

    if (user?.id) {
      loadUsageInfo();
    }
  };

  // Funciones helper
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

    // Estados centralizados de usage
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

    // Funciones de usage
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

    // PERSISTENCE: Funciones expuestas para casos especiales
    clearWorkflowState,
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
}
