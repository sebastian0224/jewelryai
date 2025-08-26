"use server";

import { changeBackgroundBria } from "../replicate";
import { getTransformedUrl, StoreImages } from "../cloudinary";

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

    // PASO 1: Transformar imagen
    const transformResult = await getTransformedUrl(
      uploadedImage,
      selectedSize
    );
    if (!transformResult.success) {
      return { success: false, error: transformResult.error };
    }

    // PASO 2: Bria
    const stylePrompt = generateStylePrompt(selectedStyle);
    const briaResult = await changeBackgroundBria(
      transformResult.transformedUrl,
      stylePrompt
    );
    if (!briaResult.success) {
      return { success: false, error: briaResult.error || "Generation failed" };
    }

    // PASO 3: Guardar - CORREGIR AQUÍ
    const storeResult = await StoreImages(
      briaResult.imageUrls, // ← era briaUrls
      userId,
      selectedStyle.name, // ← era styleUsed
      selectedSize.name // ← era sizeUsed
    );

    if (!storeResult.success) {
      return { success: false, error: storeResult.error };
    }

    // PASO 4: Procesar resultados para la UI
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
