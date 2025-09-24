"use server";

import prisma from "@/lib/prisma";

import { deleteImages } from "../cloudinary";

type DeleteImageProps = {
  imageIds: [];
  userId: string;
};

export async function deleteImagesAction({
  imageIds,
  userId,
}: DeleteImageProps) {
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

export async function getUserImagesAction(userId: string) {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    const images = await prisma.processedImage.findMany({
      where: {
        userId: userId,
        status: "saved",
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, images };
  } catch (error) {
    console.error("Error getting user images:", error);
    return { success: false, error: "Failed to get images" };
  }
}
