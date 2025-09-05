"use server";

import { changeBackgroundBria } from "../replicate";
import {
  getTransformedUrl,
  StoreImages,
  deleteOriginalImage,
} from "../cloudinary";
import { UpdateUserUsage } from "./usage-manager";

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
export async function generateImagesAction(
  uploadedImage,
  selectedStyle,
  selectedSize,
  userId,
  originalImagePublicId,
  remainingImages
) {
  try {
    if (!userId) {
      return { success: false, error: "User ID required" };
    }
    if (!uploadedImage || !selectedStyle || !selectedSize) {
      return { success: false, error: "Missing required data for generation" };
    }

    // 🚨 VALIDACIÓN TEMPRANA DE IMÁGENES DISPONIBLES
    if (remainingImages <= 0) {
      return {
        success: false,
        error: "No images remaining in your monthly quota",
      };
    }

    const stylePrompt = generateStylePrompt(selectedStyle);

    // MODO DEMO: simulamos el flujo completo
    if (DEMO_MODE) {
      console.log(
        `DEMO MODE: Generating ${remainingImages} placeholder images and storing as temporary`
      );

      // 🎯 GENERAR SOLO LAS IMÁGENES QUE EL USUARIO PUEDE USAR
      const demoImages = generatePlaceholderImages(
        selectedStyle,
        selectedSize,
        remainingImages
      );

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

      // ✅ INCREMENTAR USAGE CON EL NÚMERO REAL DE IMÁGENES GENERADAS
      const usageResult = await UpdateUserUsage(userId, processedImages.length);
      if (!usageResult.success) {
        console.warn(
          "⚠️ Warning: Could not update user monthly usage:",
          usageResult.error
        );
      } else {
        console.log(
          `✅ Usage updated immediately: +${processedImages.length} (new total: ${usageResult.newUsage})`
        );
      }

      // Eliminar imagen original de Cloudinary después de procesar exitosamente
      if (originalImagePublicId) {
        const deleteResult = await deleteOriginalImage(originalImagePublicId);
        if (deleteResult.success) {
          console.log(`✅ Original image deleted: ${originalImagePublicId}`);
        } else {
          console.warn(
            `⚠️ Warning: Could not delete original image: ${deleteResult.error}`
          );
        }
      }

      return {
        success: true,
        processedCount: processedImages.length,
        images: processedImages,
        isTemporary: true,
      };
    }

    // MODO PRODUCCIÓN: flujo real con Bria
    console.log(
      `PRODUCTION MODE: Generating ${Math.min(
        remainingImages,
        4
      )} images using real Bria API`
    );

    // Transform image to selected size using your corrected approach
    const transformResult = await getTransformedUrl(
      originalImagePublicId,
      selectedSize
    );

    if (!transformResult.success) {
      return {
        success: false,
        error: transformResult.error || "Failed to transform image",
      };
    }

    console.log("Transformed URL:", transformResult.transformedUrl);

    // 🎯 PASAR EL NÚMERO EXACTO DE IMÁGENES DISPONIBLES
    const briaResult = await changeBackgroundBria(
      transformResult.transformedUrl,
      stylePrompt,
      remainingImages // Este número ya es dinámico
    );

    if (!briaResult.success) {
      return { success: false, error: briaResult.error || "Generation failed" };
    }

    // 🔧 VALIDACIÓN DINÁMICA - NO FORZAR 4 IMÁGENES
    const generatedCount = briaResult.imageUrls?.length || 0;
    if (generatedCount === 0) {
      return {
        success: false,
        error: "No images were successfully generated",
      };
    }

    console.log(`✅ Generated ${generatedCount} images successfully`);

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

    // ✅ INCREMENTAR USAGE CON EL NÚMERO REAL DE IMÁGENES PROCESADAS
    const usageResult = await UpdateUserUsage(userId, processedImages.length);
    if (!usageResult.success) {
      console.warn(
        "⚠️ Warning: Could not update user monthly usage:",
        usageResult.error
      );
    } else {
      console.log(
        `✅ Usage updated immediately: +${processedImages.length} (new total: ${usageResult.newUsage})`
      );
    }

    // Eliminar imagen original de Cloudinary después de procesar exitosamente
    if (originalImagePublicId) {
      const deleteResult = await deleteOriginalImage(originalImagePublicId);
      if (deleteResult.success) {
        console.log(`✅ Original image deleted: ${originalImagePublicId}`);
      } else {
        console.warn(
          `⚠️ Warning: Could not delete original image: ${deleteResult.error}`
        );
      }
    }

    return {
      success: true,
      processedCount: processedImages.length,
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

// 🔧 ACTUALIZAR FUNCIÓN DE PLACEHOLDER PARA ACEPTAR CANTIDAD DINÁMICA
const generatePlaceholderImages = (selectedStyle, selectedSize, count) => {
  const { width, height } = selectedSize;

  const colors = {
    "luxury-gold": "#FFD700",
    "marble-white": "#F5F5F5",
    "velvet-black": "#1C1C1C",
    "rose-gold": "#E8B4B8",
    "crystal-clear": "#E0F6FF",
    "sapphire-blue": "#4169E1",
  };

  const selectedColor = colors[selectedStyle.id] || colors["luxury-gold"];

  const createColorImage = (color, text) => {
    return `https://dummyimage.com/${width}x${height}/${color.slice(
      1
    )}/000000.png&text=${text}`;
  };

  // 🎯 GENERAR EXACTAMENTE LA CANTIDAD SOLICITADA
  return Array.from({ length: count }, (_, index) =>
    createColorImage(selectedColor, `Demo+${index + 1}`)
  );
};
