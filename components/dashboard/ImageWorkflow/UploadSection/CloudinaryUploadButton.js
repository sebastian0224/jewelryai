"use client";

import { CldUploadButton } from "next-cloudinary";
import { Upload } from "lucide-react";

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
      <div className="inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-lg font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 bg-[#C9A227] text-white shadow-lg hover:bg-[#C9A227]/90 hover:shadow-xl hover:scale-105 h-12 px-8 py-3 text-base md:text-lg cursor-pointer border border-[#C9A227]/20 w-full md:w-auto">
        <Upload className="h-5 w-5" />
        Upload Image
      </div>
    </CldUploadButton>
  );
}
