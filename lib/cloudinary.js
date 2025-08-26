import { v2 as cloudinary } from "cloudinary";
import prisma from "./prisma";

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
});

export async function getTransformedUrl(secureUrl, selectedSize) {
  try {
    // Generar URL transformada con el tamaño específico
    const transformedUrl = cloudinary.url(secureUrl, {
      width: selectedSize.width,
      height: selectedSize.height,
      crop: "fill", // Mantiene aspect ratio y rellena completamente
      gravity: "auto", // Detección automática del área más importante
      quality: "auto", // Optimización automática de calidad
      fetch_format: "auto", // Formato automático (webp, avif, etc.)
    });

    return {
      success: true,
      transformedUrl: transformedUrl,
    };
  } catch (error) {
    console.error("❌ Transform error:", error);
    return {
      success: false,
      error: error.message || "Transform failed",
    };
  }
}

export async function StoreImages(briaUrls, userId, styleUsed, sizeUsed) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    // Validar que tengamos exactamente 4 URLs
    if (!Array.isArray(briaUrls) || briaUrls.length !== 4) {
      return {
        success: false,
        error: "Expected exactly 4 Bria URLs",
      };
    }

    // Validar datos requeridos
    if (!styleUsed || !sizeUsed) {
      return {
        success: false,
        error: "Missing required data: styleUsed or sizeUsed",
      };
    }

    const results = [];
    const cloudinaryUrls = [];
    const timestamp = Date.now();

    // Procesar cada URL de Bria individualmente
    for (let i = 0; i < briaUrls.length; i++) {
      const briaUrl = briaUrls[i];

      try {
        // Subir imagen de Bria a Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(briaUrl, {
          resource_type: "auto",
          folder: "jewelry-processed",
          tags: ["jewelry", "bria", "processed", styleUsed, sizeUsed],
          public_id: `processed_${userId}_${timestamp}_${i + 1}`,
          overwrite: true,
        });

        // Guardar registro individual en la base de datos
        const dbRecord = await prisma.processedImage.create({
          data: {
            userId: userId,
            cloudinaryUrl: cloudinaryResult.secure_url,
            styleUsed: styleUsed,
            sizeUsed: sizeUsed,
          },
        });

        // Agregar a resultados
        results.push({
          index: i + 1,
          cloudinaryUrl: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id,
          dbRecordId: dbRecord.id,
          success: true,
        });

        cloudinaryUrls.push(cloudinaryResult.secure_url);
      } catch (imageError) {
        console.error(`❌ Error processing image ${i + 1}:`, imageError);

        // Agregar resultado fallido
        results.push({
          index: i + 1,
          success: false,
          error: imageError.message || `Failed to process image ${i + 1}`,
        });
      }
    }

    // Verificar si al menos algunas imágenes se procesaron exitosamente
    const successCount = results.filter((r) => r.success).length;

    if (successCount === 0) {
      return {
        success: false,
        error: "No images were processed successfully",
        results: results,
      };
    }

    // Actualizar el uso mensual del usuario (si es necesario para tu lógica de planes)
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          monthlyUsage: {
            increment: successCount,
          },
        },
      });
    } catch (usageError) {
      console.warn(
        "⚠️ Warning: Could not update user monthly usage:",
        usageError
      );
    }

    return {
      success: true,
      processedCount: successCount,
      totalCount: briaUrls.length,
      cloudinaryUrls: cloudinaryUrls,
      results: results,
      message: `Successfully processed ${successCount} out of ${briaUrls.length} images`,
    };
  } catch (error) {
    console.error("❌ StoreImages error:", error);
    return {
      success: false,
      error: error.message || "Failed to store images",
    };
  }
}

// export async function getUserImages(limit = 50) {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return {
//         success: false,
//         error: "User not authenticated",
//       };
//     }

//     const images = await prisma.processedImage.findMany({
//       where: { userId: userId },
//       orderBy: { createdAt: "desc" },
//       take: limit,
//     });

//     return {
//       success: true,
//       images: images,
//       count: images.length,
//     };
//   } catch (error) {
//     console.error("❌ getUserImages error:", error);
//     return {
//       success: false,
//       error: error.message || "Failed to get user images",
//     };
//   }
// }
