"use server";

import { changeBackgroundBria } from "../replicate";
import { getTransformedUrl, StoreImages } from "../cloudinary";

// Cambia a false cuando quieras usar Bria real
const DEMO_MODE = true;

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

// Generar URLs de placeholder
const generatePlaceholderImages = (selectedStyle, selectedSize) => {
  const baseUrl = "https://via.placeholder.com";
  const { width, height } = selectedSize;
  const color =
    selectedStyle.id === "luxury-gold"
      ? "FFD700"
      : selectedStyle.id === "marble-white"
      ? "F5F5F5"
      : selectedStyle.id === "velvet-black"
      ? "1C1C1C"
      : selectedStyle.id === "rose-gold"
      ? "E8B4B8"
      : selectedStyle.id === "crystal-clear"
      ? "E0F6FF"
      : "4169E1";

  return [
    `${baseUrl}/${width}x${height}/${color}/000000?text=Demo+1`,
    `${baseUrl}/${width}x${height}/${color}/000000?text=Demo+2`,
    `${baseUrl}/${width}x${height}/${color}/000000?text=Demo+3`,
    `${baseUrl}/${width}x${height}/${color}/000000?text=Demo+4`,
  ];
};

export async function generateImagesAction(
  uploadedImage,
  selectedStyle,
  selectedSize,
  userId
) {
  try {
    if (!userId) {
      return { success: false, error: "User ID required" };
    }
    if (!uploadedImage || !selectedStyle || !selectedSize) {
      return { success: false, error: "Missing required data for generation" };
    }

    const stylePrompt = generateStylePrompt(selectedStyle);

    // 🔹 MODO DEMO: no gastamos créditos
    if (DEMO_MODE) {
      console.log("DEMO MODE: Using placeholder images instead of Bria");
      const demoImages = generatePlaceholderImages(selectedStyle, selectedSize);

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const processedImages = demoImages.map((url, index) => ({
        id: `demo-${index + 1}`,
        imageUrl: url,
        background: selectedStyle.name,
        size: selectedSize.name,
        prompt: stylePrompt + " (DEMO)",
        index: index + 1,
      }));

      return {
        success: true,
        processedCount: processedImages.length,
        images: processedImages,
      };
    }

    // 🔹 MODO PRODUCCIÓN: flujo real con Bria
    console.log("PRODUCTION MODE: Using real Bria API");

    const transformedUrl = getTransformedUrl(
      uploadedImage,
      selectedSize.width,
      selectedSize.height
    );

    const briaResult = await changeBackgroundBria(transformedUrl, stylePrompt);
    if (!briaResult.success) {
      return { success: false, error: briaResult.error || "Generation failed" };
    }

    const storeResult = await StoreImages(
      briaResult.imageUrls,
      userId,
      selectedStyle.name,
      selectedSize.name
    );

    if (!storeResult.success) {
      return { success: false, error: storeResult.error };
    }

    const processedImages = storeResult.results
      .filter((result) => result.success)
      .map((result) => ({
        id: result.dbRecordId,
        imageUrl: result.cloudinaryUrl,
        background: selectedStyle.name,
        size: selectedSize.name,
        prompt: stylePrompt,
        index: result.index,
      }));

    return {
      success: true,
      processedCount: storeResult.processedCount,
      images: processedImages,
    };
  } catch (error) {
    console.error("Generation error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate images",
    };
  }
}
