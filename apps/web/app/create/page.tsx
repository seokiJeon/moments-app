"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { addMoment } from "@/lib/db";
import { createThumbnail, formatDate } from "@/lib/image";

export default function CreatePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);
  const now = new Date().toISOString();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!memo.trim() && !selectedFile) return;
    setSaving(true);
    try {
      let imageBlob: Blob | undefined;
      let thumbBlob: Blob | undefined;
      if (selectedFile) {
        imageBlob = selectedFile;
        thumbBlob = await createThumbnail(selectedFile);
      }
      await addMoment({ memo: memo.trim() || undefined, imageBlob, thumbBlob });
      router.push("/");
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  }, [memo, selectedFile, router]);

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#080808" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #2A4A15" }}
      >
        <button
          onClick={() => router.back()}
          className="text-sm px-3 py-1 transition-opacity hover:opacity-70"
          style={{ color: "#5A8A30", border: "1px solid #2A4A15" }}
        >
          [ ESC ]
        </button>
        <span className="text-xs" style={{ color: "#5A8A30" }}>
          NEW ENTRY
        </span>
        <button
          onClick={handleSave}
          disabled={saving || (!memo.trim() && !selectedFile)}
          className="text-sm px-3 py-1 font-bold transition-all disabled:opacity-30"
          style={{
            background: saving || (!memo.trim() && !selectedFile) ? "transparent" : "#B6FF6D",
            color: saving || (!memo.trim() && !selectedFile) ? "#5A8A30" : "#080808",
            border: "1px solid #B6FF6D",
          }}
        >
          {saving ? "SAVING..." : "[ SAVE ]"}
        </button>
      </header>

      <div className="flex flex-col flex-1 p-4 gap-4">
        {/* Auto timestamp */}
        <div className="text-xs" style={{ color: "#5A8A30" }}>
          &gt; {formatDate(now)}
        </div>

        {/* Image area */}
        <div
          className="relative w-full cursor-pointer group"
          style={{
            border: previewUrl ? "1px solid #2A4A15" : "1px dashed #2A4A15",
            minHeight: "240px",
            background: "#0F0F0F",
          }}
          onClick={() => fileRef.current?.click()}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="w-full object-contain"
              style={{ maxHeight: "400px" }}
            />
          ) : (
            <div
              className="flex flex-col items-center justify-center h-60 gap-2"
              style={{ color: "#5A8A30" }}
            >
              <span className="text-2xl">[ ▣ ]</span>
              <span className="text-xs">ATTACH IMAGE (optional)</span>
              <span className="text-xs opacity-50">click to browse</span>
            </div>
          )}
          {previewUrl && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              style={{ background: "rgba(0,0,0,0.5)" }}>
              <span className="text-xs" style={{ color: "#B6FF6D" }}>[ CHANGE IMAGE ]</span>
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Memo input */}
        <div style={{ border: "1px solid #2A4A15" }}>
          <div className="px-3 py-1 text-xs" style={{ color: "#5A8A30", borderBottom: "1px solid #2A4A15" }}>
            &gt; MEMO_
          </div>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="오늘의 순간을 기록하세요..."
            rows={4}
            className="w-full px-3 py-3 text-sm resize-none outline-none"
            style={{
              background: "#0F0F0F",
              color: "#B6FF6D",
              fontFamily: "'DungGeunMo', monospace",
              caretColor: "#B6FF6D",
            }}
          />
        </div>
      </div>
    </main>
  );
}
