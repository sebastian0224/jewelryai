import { v2 as cloudinary } from "cloudinary";

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
});

export async function getTransformedUrl(
  publicId,
  width,
  height,
  crop = "fill"
) {
  try {
    const cloudinaryResult = await cloudinary.uploader.upload(
      replicateResult.imageUrl,
      {
        resource_type: "auto",
        folder: "jewelry-processed",
        tags: ["jewelry", "bria", "processed"],
        // Opcional: añadir timestamp al nombre
        public_id: `processed_${Date.now()}`,
      }
    );

    return {
      success: true,
      cloudinaryUrl: cloudinaryResult.secure_url,
    };
  } catch (error) {
    console.error("❌ Process error:", error);
    return {
      success: false,
      error: error.message || "Processing failed",
    };
  }
}

export async function StoreImages(secure_url) {
  try {
    const cloudinaryResult = await cloudinary.uploader.upload(
      replicateResult.imageUrl,
      {
        resource_type: "auto",
        folder: "jewelry-processed",
        tags: ["jewelry", "bria", "processed"],
        // Opcional: añadir timestamp al nombre
        public_id: `processed_${Date.now()}`,
      }
    );

    return {
      success: true,
      cloudinaryUrl: cloudinaryResult.secure_url,
    };
  } catch (error) {
    console.error("❌ Process error:", error);
    return {
      success: false,
      error: error.message || "Processing failed",
    };
  }
}
