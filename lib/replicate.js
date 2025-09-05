"use server";

import Replicate from "replicate";

const replicate = new Replicate();

export async function changeBackgroundBria(imageUrl, prompt, remainingImages) {
  try {
    // 🎯 GENERAR ENTRE 1 Y 4 IMÁGENES SEGÚN LO DISPONIBLE
    const imagesToGenerate = Math.min(Math.max(remainingImages, 1), 4); // Min 1, Max 4

    console.log(
      `🎯 User has ${remainingImages} images remaining - generating ${imagesToGenerate} images`
    );

    if (remainingImages <= 0) {
      return {
        success: false,
        error: "No remaining images available for generation",
        imageUrls: [],
      };
    }

    let imageUrls = [];
    const maxRetries = 2;

    // Generar exactamente las imágenes que el usuario puede usar
    for (let i = 0; i < imagesToGenerate; i++) {
      let success = false;
      let retries = 0;

      while (!success && retries < maxRetries) {
        try {
          console.log(
            `🔄 Generating image ${i + 1}/${imagesToGenerate} (attempt ${
              retries + 1
            })`
          );

          const result = await replicate.run("bria/generate-background", {
            input: {
              fast: true,
              sync: true,
              image_url: imageUrl,
              bg_prompt: prompt,
              refine_prompt: true,
              original_quality: true,
              enhance_ref_image: true,
            },
          });

          // Manejar diferentes formatos de respuesta de Bria
          let processedUrl;
          if (Array.isArray(result)) {
            processedUrl = result[0]?.toString();
          } else if (typeof result === "string") {
            processedUrl = result;
          } else if (result?.image_url) {
            processedUrl = result.image_url.toString();
          } else {
            throw new Error(`Invalid Bria response format: ${typeof result}`);
          }

          if (processedUrl && processedUrl.startsWith("http")) {
            imageUrls.push(processedUrl);
            success = true;
            console.log(
              `✅ Image ${i + 1}/${imagesToGenerate} generated successfully`
            );
          } else {
            throw new Error(`Invalid URL received: ${processedUrl}`);
          }
        } catch (error) {
          retries++;
          console.warn(
            `⚠️ Attempt ${retries} failed for image ${i + 1}:`,
            error.message
          );

          if (retries >= maxRetries) {
            console.error(
              `❌ Failed to generate image ${
                i + 1
              } after ${maxRetries} attempts`
            );
            // Si falla una imagen individual, continuar con las demás
          }
        }
      }
    }

    // ✅ NO FORZAR 4 IMÁGENES - devolver las que se generaron exitosamente
    console.log(
      `🎯 Successfully generated ${imageUrls.length}/${imagesToGenerate} images`
    );

    if (imageUrls.length === 0) {
      throw new Error("Failed to generate any valid images from Bria");
    }

    console.log(
      "📋 Generated URLs:",
      imageUrls.map((url, i) => `${i + 1}: ${url.substring(0, 50)}...`)
    );

    return {
      success: true,
      imageUrls: imageUrls,
      generatedCount: imageUrls.length, // ✨ Agregar contador de imágenes generadas
    };
  } catch (error) {
    console.error("❌ Bria error:", error);
    return {
      success: false,
      error: error.message || "Bria processing failed",
      imageUrls: [],
    };
  }
}
