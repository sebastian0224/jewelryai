"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { generateImagesAction } from "@/lib/actions/generate-images";
import { useUsage } from "@/components/dashboard/UsageContext";
import { useUser } from "@clerk/nextjs";

const WorkflowContext = createContext(undefined);

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
}

export function WorkflowProvider({ children }) {
  const { user } = useUser();
  const { usageStatus, usageData, usageError, refreshUsage, remainingImages } =
    useUsage();

  // Main workflow states
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [originalImagePublicId, setOriginalImagePublicId] = useState(null);

  // Generation states
  const [generationState, setGenerationState] = useState("ready");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isTemporary, setIsTemporary] = useState(false);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Control state for localStorage initialization
  const [isInitialized, setIsInitialized] = useState(false);

  // PERSISTENCE: Constants
  const STORAGE_KEY = "jewelry-workflow";
  const STORAGE_VERSION = "1.0";
  const EXPIRY_HOURS = 24;

  // PERSISTENCE: Save workflow state to localStorage
  const saveWorkflowState = () => {
    if (!isInitialized) return;

    const stateToSave = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      userId: user?.id || null,
      currentStep,
      uploadedImage,
      selectedStyle,
      selectedSize,
      originalImagePublicId,
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

  // PERSISTENCE: Load workflow state from localStorage
  const loadWorkflowState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const parsedState = JSON.parse(saved);

      if (parsedState.version !== STORAGE_VERSION) {
        console.log("🔄 Workflow version mismatch, clearing localStorage");
        clearWorkflowState();
        return null;
      }

      const now = Date.now();
      const age = now - parsedState.timestamp;
      const maxAge = EXPIRY_HOURS * 60 * 60 * 1000;

      if (age > maxAge) {
        console.log("⏰ Workflow state expired, clearing localStorage");
        clearWorkflowState();
        return null;
      }

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

  // PERSISTENCE: Clear localStorage
  const clearWorkflowState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log("🧹 Workflow state cleared from localStorage");
    } catch (error) {
      console.warn("⚠️ Failed to clear workflow state:", error);
    }
  };

  // PERSISTENCE: Load state on initialization
  useEffect(() => {
    if (user?.id && !isInitialized) {
      const savedState = loadWorkflowState();

      if (savedState) {
        setCurrentStep(savedState.currentStep || 1);
        setUploadedImage(savedState.uploadedImage);
        setSelectedStyle(savedState.selectedStyle);
        setSelectedSize(savedState.selectedSize);
        setOriginalImagePublicId(savedState.originalImagePublicId);

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

  // PERSISTENCE: Auto-save when relevant state changes
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

  // Helper function to extract public_id from Cloudinary URL
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

  // Updated function to set uploaded image
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
        originalImagePublicId,
        remainingImages
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      setGeneratedImages(result.images);
      setSelectedImages(result.images.map((img) => img.id));
      setIsTemporary(result.isTemporary || false);
      setGenerationState("results");

      // 🔄 REFRESH USAGE IN SHARED CONTEXT - This updates UsageBar automatically
      await refreshUsage();

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

  // PERSISTENCE: Handle save/discard callback (clears localStorage)
  const handleImagesProcessed = async (action, result) => {
    if (action === "saved") {
      console.log(
        `Images saved successfully: ${result.savedCount} saved, ${result.discardedCount} discarded`
      );
      await refreshUsage();
      clearWorkflowState();
      resetWorkflow();
    } else if (action === "discarded") {
      console.log(`All images discarded: ${result.discardedCount} discarded`);
      clearWorkflowState();
      resetWorkflow();
    }
  };

  // PERSISTENCE: Updated reset function (also clears localStorage)
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

    clearWorkflowState();

    if (user?.id) {
      refreshUsage();
    }
  };

  // Helper functions
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

  // Context value passed to components
  const contextValue = {
    // Main states
    currentStep,
    uploadedImage,
    selectedStyle,
    selectedSize,
    originalImagePublicId,

    // Generation states
    generationState,
    generatedImages,
    selectedImages,
    isTemporary,

    // User info
    userId: user?.id,

    // UI states
    isLoading,
    error,

    // Usage states (from shared context)
    usageStatus,
    usageInfo: usageData,
    usageError,

    // Navigation functions
    goToStep,
    nextStep,
    prevStep,
    resetWorkflow,

    // Data functions
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

    // Usage functions (from shared context)
    loadUsageInfo: refreshUsage,
    refreshUsageInfo: refreshUsage,

    // Generation functions
    generateImages,

    // Image selection functions
    handleImageSelect,
    selectAllImages,

    // Save/discard function
    handleImagesProcessed,

    // Utility functions
    canGoToStep,
    getProgress,

    // PERSISTENCE: Exposed functions for special cases
    clearWorkflowState,
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
}
