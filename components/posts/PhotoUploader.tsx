"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { X, Plus } from "lucide-react";
import { CLOUDINARY_UPLOAD_PRESET, MAX_PHOTOS_PER_POST } from "@/lib/cloudinary-config";

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUploadSuccess = (result: { info?: { secure_url?: string } | string }) => {
    if (result.info && typeof result.info === "object" && result.info.secure_url) {
      onChange([...photos, result.info.secure_url]);
    }
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {photos.map((url, i) => (
          <div
            key={url}
            className="relative w-24 h-24 rounded-lg overflow-hidden border bg-gray-50"
            style={{ borderWidth: "0.5px" }}
          >
            <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="96px" />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80 transition"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {photos.length < MAX_PHOTOS_PER_POST && (
          <CldUploadWidget
            uploadPreset={CLOUDINARY_UPLOAD_PRESET}
            options={{
              maxFiles: MAX_PHOTOS_PER_POST - photos.length,
              resourceType: "image",
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
              maxFileSize: 10000000,
            }}
            onSuccess={handleUploadSuccess}
            onQueuesStart={() => setUploading(true)}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                disabled={uploading}
                className="w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[#1D9E75] hover:text-[#1D9E75] transition disabled:opacity-50"
                style={{ borderColor: "#d1d5db" }}
              >
                {uploading ? (
                  <span className="text-xs">Uploading...</span>
                ) : (
                  <>
                    <Plus size={20} />
                    <span className="text-xs">Add photo</span>
                  </>
                )}
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>

      <p className="mt-1.5 text-xs text-gray-400">
        {photos.length}/{MAX_PHOTOS_PER_POST} photos · JPG, PNG, WebP · max 10MB each
      </p>
    </div>
  );
}
