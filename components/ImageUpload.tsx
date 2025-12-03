"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

interface ImageUploadProps {
  onUploadComplete: (url: string, filename: string) => void;
  onError: (error: string) => void;
  bucket: string;
}

export default function ImageUpload({
  onUploadComplete,
  onError,
  bucket,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      onError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      onError("Image must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    setUploading(true);
    try {
      const filename = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
      onUploadComplete(data.publicUrl, filename);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      onError(errorMessage || "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
        id="image-input"
      />

      {preview && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-sm font-medium">Uploading...</div>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-center hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50"
      >
        <div className="text-sm font-medium text-gray-700">
          {uploading ? "Uploading..." : "Click to select image"}
        </div>
        <div className="text-xs text-gray-500 mt-1">or drag and drop</div>
      </button>
    </div>
  );
}
