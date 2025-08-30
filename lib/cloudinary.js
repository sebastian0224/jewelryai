import { v2 as cloudinary } from "cloudinary";
import prisma from "./prisma";

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
});

export async function getTransformedUrl(publicId, selectedSize) {
  try {
    // // Generar URL transformada con el tamaño específico
    // const transformedUrl = cloudinary.url(secureUrl, {
    //   width: selectedSize.width,
    //   height: selectedSize.height,
    //   crop: "fill", // Mantiene aspect ratio y rellena completamente
    //   gravity: "auto", // Detección automática del área más importante
    //   quality: "auto", // Optimización automática de calidad
    //   fetch_format: "auto", // Formato automático (webp, avif, etc.)
    // });

    // return {
    //   success: true,
    //   transformedUrl: transformedUrl,
    // };
    const transformedUrl = cloudinary.url(publicId, {
      width: selectedSize.width,
      height: selectedSize.height,
      crop: "fill",
      gravity: "auto",
      quality: "auto",
      fetch_format: "auto",
      secure: true,
    });
    return { success: true, transformedUrl };
  } catch (error) {
    console.error("❌ Transform error:", error);
    return {
      success: false,
      error: error.message || "Transform failed",
    };
  }
}

export async function StoreImages(
  briaUrls,
  userId,
  styleUsed,
  sizeUsed,
  options = {}
) {
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
    const isTemporary = options.status === "temporary";

    // Procesar cada URL de Bria individualmente
    for (let i = 0; i < briaUrls.length; i++) {
      const briaUrl = briaUrls[i];

      try {
        // Subir imagen de Bria a Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(briaUrl, {
          resource_type: "auto",
          folder: isTemporary ? "jewelry-temporary" : "jewelry-processed",
          tags: [
            "jewelry",
            "bria",
            isTemporary ? "temporary" : "processed",
            styleUsed,
            sizeUsed,
          ],
          public_id: `${
            isTemporary ? "temp" : "processed"
          }_${userId}_${timestamp}_${i + 1}`,
          overwrite: true,
        });

        // Guardar registro individual en la base de datos
        const dbRecord = await prisma.processedImage.create({
          data: {
            userId: userId,
            cloudinaryUrl: cloudinaryResult.secure_url,
            cloudinaryPublicId: cloudinaryResult.public_id,
            styleUsed: styleUsed,
            sizeUsed: sizeUsed,
            status: isTemporary ? "temporary" : "saved",
            expiresAt: isTemporary
              ? new Date(Date.now() + 2 * 60 * 60 * 1000)
              : null, // 2 horas
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

    // Solo actualizar usage si no son temporales
    if (!isTemporary) {
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
    }

    return {
      success: true,
      processedCount: successCount,
      totalCount: briaUrls.length,
      cloudinaryUrls: cloudinaryUrls,
      results: results,
      message: `Successfully processed ${successCount} out of ${
        briaUrls.length
      } images as ${isTemporary ? "temporary" : "permanent"}`,
    };
  } catch (error) {
    console.error("❌ StoreImages error:", error);
    return {
      success: false,
      error: error.message || "Failed to store images",
    };
  }
}

export async function saveSelectedImages(imageIds, userId) {
  try {
    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return {
        success: false,
        error: "No images selected to save",
      };
    }

    // Obtener imágenes temporales del usuario
    const temporaryImages = await prisma.processedImage.findMany({
      where: {
        id: { in: imageIds },
        userId: userId,
        status: "temporary",
      },
    });

    if (temporaryImages.length === 0) {
      return {
        success: false,
        error: "No temporary images found to save",
      };
    }

    const savedImages = [];

    // Procesar cada imagen seleccionada
    for (const image of temporaryImages) {
      try {
        const timestamp = Date.now();
        const newPublicId = `processed_${userId}_${timestamp}_${
          savedImages.length + 1
        }`;

        // CORREGIDO: Usar upload + destroy en lugar de rename
        // 1. Subir la imagen a la carpeta permanent con nuevo public_id
        const moveResult = await cloudinary.uploader.upload(
          image.cloudinaryUrl,
          {
            resource_type: "auto",
            folder: "jewelry-processed",
            tags: [
              "jewelry",
              "bria",
              "processed",
              image.styleUsed,
              image.sizeUsed,
            ],
            public_id: newPublicId,
            overwrite: true,
          }
        );

        // 2. Eliminar la imagen original de la carpeta temporal
        await cloudinary.uploader.destroy(image.cloudinaryPublicId);

        // 3. Actualizar el registro en la base de datos
        const updatedImage = await prisma.processedImage.update({
          where: { id: image.id },
          data: {
            status: "saved",
            cloudinaryUrl: moveResult.secure_url,
            cloudinaryPublicId: moveResult.public_id,
            expiresAt: null,
            savedAt: new Date(),
          },
        });

        savedImages.push(updatedImage);
      } catch (moveError) {
        console.error(`❌ Error saving image ${image.id}:`, moveError);
      }
    }

    // Actualizar el usage mensual del usuario
    if (savedImages.length > 0) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            monthlyUsage: {
              increment: savedImages.length,
            },
          },
        });
      } catch (usageError) {
        console.warn(
          "⚠️ Warning: Could not update user monthly usage:",
          usageError
        );
      }
    }

    return {
      success: true,
      savedCount: savedImages.length,
      savedImages: savedImages,
      message: `Successfully saved ${savedImages.length} images`,
    };
  } catch (error) {
    console.error("❌ saveSelectedImages error:", error);
    return {
      success: false,
      error: error.message || "Failed to save selected images",
    };
  }
}

export async function discardTemporaryImages(userId, excludeIds = []) {
  try {
    // Obtener todas las imágenes temporales del usuario (excluyendo las seleccionadas)
    const temporaryImages = await prisma.processedImage.findMany({
      where: {
        userId: userId,
        status: "temporary",
        id: excludeIds.length > 0 ? { notIn: excludeIds } : undefined,
      },
    });

    if (temporaryImages.length === 0) {
      return {
        success: true,
        discardedCount: 0,
        message: "No temporary images to discard",
      };
    }

    const discardedImages = [];

    // Eliminar cada imagen de Cloudinary y BD
    for (const image of temporaryImages) {
      try {
        // Eliminar de Cloudinary
        await cloudinary.uploader.destroy(image.cloudinaryPublicId);

        // Eliminar de la base de datos
        await prisma.processedImage.delete({
          where: { id: image.id },
        });

        discardedImages.push(image);
      } catch (deleteError) {
        console.error(`❌ Error discarding image ${image.id}:`, deleteError);
      }
    }

    return {
      success: true,
      discardedCount: discardedImages.length,
      message: `Successfully discarded ${discardedImages.length} temporary images`,
    };
  } catch (error) {
    console.error("❌ discardTemporaryImages error:", error);
    return {
      success: false,
      error: error.message || "Failed to discard temporary images",
    };
  }
}

// NUEVA FUNCIÓN: Eliminar imágenes permanentes de la galería
export async function deleteImages(imageIds, userId) {
  try {
    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return {
        success: false,
        error: "No images selected to delete",
      };
    }

    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    // Obtener imágenes del usuario (solo las que le pertenecen)
    const userImages = await prisma.processedImage.findMany({
      where: {
        id: { in: imageIds },
        userId: userId,
        status: "saved", // Solo imágenes permanentes de la galería
      },
    });

    if (userImages.length === 0) {
      return {
        success: false,
        error: "No images found to delete or you don't have permission",
      };
    }

    const deletedImages = [];

    // Eliminar cada imagen de Cloudinary y BD
    for (const image of userImages) {
      try {
        // Eliminar de Cloudinary
        if (image.cloudinaryPublicId) {
          await cloudinary.uploader.destroy(image.cloudinaryPublicId);
        }

        // Eliminar de la base de datos
        await prisma.processedImage.delete({
          where: { id: image.id },
        });

        deletedImages.push(image);
      } catch (deleteError) {
        console.error(`❌ Error deleting image ${image.id}:`, deleteError);
      }
    }

    // Actualizar el usage mensual del usuario (decrementar)
    if (deletedImages.length > 0) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            monthlyUsage: {
              decrement: deletedImages.length,
            },
          },
        });
      } catch (usageError) {
        console.warn(
          "⚠️ Warning: Could not update user monthly usage:",
          usageError
        );
      }
    }

    return {
      success: true,
      deletedCount: deletedImages.length,
      deletedImages: deletedImages,
      message: `Successfully deleted ${deletedImages.length} images`,
    };
  } catch (error) {
    console.error("❌ deleteImages error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete images",
    };
  }
}
