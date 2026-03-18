"use client";

import { useState } from "react";
import { storageApi, profilesApi } from "@/lib/api";

type Props = {
  userId: string;
  currentUrl?: string | null;
  onUpdate?: (url: string | null) => void;
};

export default function AvatarUploader({ userId, currentUrl, onUpdate }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file?: File | null) => {
    setError(null);
    if (!file) return;
    try {
      setLoading(true);
      const res = await storageApi.uploadAvatar(userId, file);
      if (res.error) throw res.error;
      const path = res.data.path;
      const publicUrl = res.data.publicUrl;
      await profilesApi.update(userId, { avatar_url: publicUrl });

      setPreview(publicUrl);
      onUpdate?.(publicUrl);
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-neutral-100 rounded overflow-hidden flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="text-neutral-400">No avatar</div>
          )}
        </div>
        <div>
          <label className="btn-outline cursor-pointer inline-block">
            {loading ? "Uploading…" : "Change Avatar"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </label>
          {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
}
