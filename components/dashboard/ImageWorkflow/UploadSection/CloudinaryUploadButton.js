"use client";

import { CldUploadButton } from "next-cloudinary";

export function CloudinaryUploadButton({ onUploadSuccess }) {
  return (
    <CldUploadButton
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
      onSuccess={(result) => {
        onUploadSuccess(result.info.secure_url);
      }}
      onError={(error) => {
        console.error("Upload error:", error);
      }}
      options={{
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: ["jpg", "jpeg", "png"],
        maxFileSize: 10000000, // 10MB
      }}
    >
      <div
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md  font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 px-8 py-3 text-lg cursor-pointer"
        style={{
          opacity: 1,
          pointerEvents: "auto",
        }}
      >
        📷 Upload Image
      </div>
    </CldUploadButton>
  );
}
