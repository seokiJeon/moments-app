"use client";

const THUMB_SIZE = 200;

export async function createThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = THUMB_SIZE;
      canvas.height = THUMB_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));

      // Cover crop: center
      const ratio = Math.max(THUMB_SIZE / img.width, THUMB_SIZE / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const x = (THUMB_SIZE - w) / 2;
      const y = (THUMB_SIZE - h) / 2;

      ctx.drawImage(img, x, y, w, h);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Blob conversion failed"));
        },
        "image/jpeg",
        0.8
      );
    };

    img.onerror = reject;
    img.src = url;
  });
}

export function createObjectURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export function formatMonthHeader(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// "03.01" — day label on each thumbnail
export function formatDayLabel(isoString: string): string {
  const d = new Date(isoString);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}.${dd}`;
}
