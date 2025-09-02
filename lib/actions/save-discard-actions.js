"use server";

import { saveSelectedImages, discardTemporaryImages } from "../cloudinary";

export async function saveSelectedImagesAction(imageIds, userId) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return {
        success: false,
        error: "No images selected to save",
      };
    }

    // Guardar las imágenes seleccionadas
    const saveResult = await saveSelectedImages(imageIds, userId);

    if (!saveResult.success) {
      return saveResult;
    }

    // Descartar las imágenes no seleccionadas del mismo usuario
    const discardResult = await discardTemporaryImages(userId, imageIds);

    return {
      success: true,
      savedCount: saveResult.savedCount,
      discardedCount: discardResult.discardedCount,
      savedImages: saveResult.savedImages,
      message: `Successfully saved ${saveResult.savedCount} images and discarded ${discardResult.discardedCount} temporary images`,
    };
  } catch (error) {
    console.error("❌ saveSelectedImagesAction error:", error);
    return {
      success: false,
      error: error.message || "Failed to save selected images",
    };
  }
}

export async function discardAllImagesAction(userId) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const discardResult = await discardTemporaryImages(userId);

    return {
      success: true,
      discardedCount: discardResult.discardedCount,
      message: `Successfully discarded ${discardResult.discardedCount} temporary images`,
    };
  } catch (error) {
    console.error("❌ discardAllImagesAction error:", error);
    return {
      success: false,
      error: error.message || "Failed to discard all images",
    };
  }
}
