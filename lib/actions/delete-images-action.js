"use server";

import { deleteImages } from "../cloudinary";

export async function deleteImagesAction(imageIds, userId) {
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
        error: "No images selected to delete",
      };
    }

    const result = await deleteImages(imageIds, userId);

    return result;
  } catch (error) {
    console.error("❌ deleteImagesAction error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete images",
    };
  }
}
