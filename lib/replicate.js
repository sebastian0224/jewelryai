"use server";

import Replicate from "replicate";

const replicate = new Replicate();

export async function changeBackgroundBria(imageUrl, prompt) {
  try {
    let imageUrls = [];

    const tasks = Array.from({ length: 4 }).map(() =>
      replicate.run("bria/generate-background", {
        input: {
          fast: true,
          sync: true,
          image_url: imageUrl,
          bg_prompt: prompt,
          refine_prompt: true,
          original_quality: true,
          enhance_ref_image: true,
        },
      })
    );

    const results = await Promise.all(tasks);
    imageUrls = results.flat().map((url) => url.toString());

    console.log("Final Parsed URLs:", imageUrls);

    return {
      success: true,
      imageUrls: imageUrls,
    };
  } catch (error) {
    console.error("Bria error:", error);
    return {
      success: false,
      error: error.message || "Bria processing failed",
      imageUrls: [],
    };
  }
}
