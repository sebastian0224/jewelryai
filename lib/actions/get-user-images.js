"use server";

import prisma from "@/lib/prisma";

export async function getUserImagesAction(userId) {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    const images = await prisma.processedImage.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, images };
  } catch (error) {
    console.error("Error getting user images:", error);
    return { success: false, error: "Failed to get images" };
  }
}
