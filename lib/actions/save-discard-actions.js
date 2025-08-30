"use server";

import { saveSelectedImages, discardTemporaryImages } from "../cloudinary";
import { v2 as cloudinary } from "cloudinary";

export async function saveSelectedImagesAction(
  imageIds,
  userId,
  originalImagePublicId
) {
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

    // Eliminar la imagen original del usuario si se proporcionó el public_id
    let originalImageDeleted = false;
    if (originalImagePublicId) {
      try {
        await cloudinary.uploader.destroy(originalImagePublicId);
        originalImageDeleted = true;
        console.log(`✅ Original image deleted: ${originalImagePublicId}`);
      } catch (deleteError) {
        console.error(
          `⚠️ Warning: Could not delete original image ${originalImagePublicId}:`,
          deleteError
        );
        // No fallar la operación completa por esto
      }
    }

    return {
      success: true,
      savedCount: saveResult.savedCount,
      discardedCount: discardResult.discardedCount,
      originalImageDeleted,
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

/**
 * Server action para descartar todas las imágenes temporales
 * @param {string} userId - ID del usuario
 * @param {string} originalImagePublicId - Public ID de la imagen original del usuario
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function discardAllImagesAction(userId, originalImagePublicId) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const discardResult = await discardTemporaryImages(userId);

    // Eliminar la imagen original del usuario si se proporcionó el public_id
    let originalImageDeleted = false;
    if (originalImagePublicId) {
      try {
        await cloudinary.uploader.destroy(originalImagePublicId);
        originalImageDeleted = true;
        console.log(`✅ Original image deleted: ${originalImagePublicId}`);
      } catch (deleteError) {
        console.error(
          `⚠️ Warning: Could not delete original image ${originalImagePublicId}:`,
          deleteError
        );
      }
    }

    return {
      success: true,
      discardedCount: discardResult.discardedCount,
      originalImageDeleted,
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
