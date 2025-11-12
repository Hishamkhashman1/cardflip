"use client";

import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";

import type { AppFileRouter } from "@/app/api/uploadthing/core";

export function CardImageUpload({ value, onChange }: { value?: string; onChange: (url: string) => void }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Card image</label>
      <UploadDropzone<AppFileRouter>
        endpoint="cardImage"
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.url;
          if (url) {
            onChange(url);
            setError(null);
          }
        }}
        onUploadError={(err) => setError(err.message)}
      />
      <div className="space-y-1 text-sm">
        <span>Or paste an external image URL</span>
        <input
          type="url"
          placeholder="https://example.com/my-card.png"
          className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
