"use server";

import { changeBackgroundBria } from "../replicate";
import { getTransformedUrl, StoreImages } from "../cloudinary";

// Cambia a false cuando quieras usar Bria real
const DEMO_MODE = false;

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

// Generar URLs de placeholder (para demo mode)
const generatePlaceholderImages = (selectedStyle, selectedSize) => {
  const { width, height } = selectedSize;

  // Crear imágenes sólidas de colores usando data URLs
  const colors = {
    "luxury-gold": "#FFD700",
    "marble-white": "#F5F5F5",
    "velvet-black": "#1C1C1C",
    "rose-gold": "#E8B4B8",
    "crystal-clear": "#E0F6FF",
    "sapphire-blue": "#4169E1",
  };

  const selectedColor = colors[selectedStyle.id] || colors["luxury-gold"];

  // Crear canvas y generar imagen base64
  const createColorImage = (color, text) => {
    // Usar un servicio más confiable o generar programáticamente
    return `https://dummyimage.com/${width}x${height}/${color.slice(
      1
    )}/000000.png&text=${text}`;
  };

  return [
    createColorImage(selectedColor, "Demo+1"),
    createColorImage(selectedColor, "Demo+2"),
    createColorImage(selectedColor, "Demo+3"),
    createColorImage(selectedColor, "Demo+4"),
  ];
};

export async function generateImagesAction(
  uploadedImage,
  selectedStyle,
  selectedSize,
  userId,
  originalImagePublicId
) {
  try {
    if (!userId) {
      return { success: false, error: "User ID required" };
    }
    if (!uploadedImage || !selectedStyle || !selectedSize) {
      return { success: false, error: "Missing required data for generation" };
    }

    const stylePrompt = generateStylePrompt(selectedStyle);

    // MODO DEMO: simulamos el flujo completo
    if (DEMO_MODE) {
      console.log(
        "DEMO MODE: Using placeholder images and storing as temporary"
      );
      const demoImages = generatePlaceholderImages(selectedStyle, selectedSize);

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Guardar como temporales en Cloudinary y BD
      const storeResult = await StoreImages(
        demoImages,
        userId,
        selectedStyle.name,
        selectedSize.name,
        { status: "temporary" }
      );

      if (!storeResult.success) {
        return { success: false, error: storeResult.error };
      }

      const processedImages = storeResult.results
        .filter((result) => result.success)
        .map((result, index) => ({
          id: result.dbRecordId,
          imageUrl: result.cloudinaryUrl,
          background: selectedStyle.name,
          size: selectedSize.name,
          prompt: stylePrompt + " (DEMO)",
          index: index + 1,
          status: "temporary",
        }));

      return {
        success: true,
        processedCount: processedImages.length,
        images: processedImages,
        isTemporary: true,
      };
    }

    // MODO PRODUCCIÓN: flujo real con Bria
    console.log(
      "PRODUCTION MODE: Using real Bria API and storing as temporary"
    );

    // const transformedUrl = getTransformedUrl(
    //   uploadedImage,
    //   selectedSize.width,
    //   selectedSize.height
    // );

    const { transformedUrl } = await getTransformedUrl(
      originalImagePublicId, // 👈 asegúrate de tener el publicId disponible
      selectedSize
    );

    console.log(transformedUrl);

    const briaResult = await changeBackgroundBria(transformedUrl, stylePrompt);
    if (!briaResult.success) {
      return { success: false, error: briaResult.error || "Generation failed" };
    }

    // Guardar inmediatamente como temporales para evitar expiración de URLs de Bria (1 hora)
    const storeResult = await StoreImages(
      briaResult.imageUrls,
      userId,
      selectedStyle.name,
      selectedSize.name,
      { status: "temporary" }
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
        status: "temporary",
      }));

    return {
      success: true,
      processedCount: storeResult.processedCount,
      images: processedImages,
      isTemporary: true,
    };
  } catch (error) {
    console.error("Generation error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate images",
    };
  }
}
