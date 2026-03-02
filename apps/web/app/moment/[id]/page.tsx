"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getMoment, deleteMoment, type Moment } from "@/lib/db";
import { createObjectURL, formatDate } from "@/lib/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MomentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [moment, setMoment] = useState<Moment | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMoment(id).then((m) => {
      if (!m) {
        router.push("/");
        return;
      }
      setMoment(m);
      if (m.imageBlob) {
        setImgSrc(createObjectURL(m.imageBlob));
      }
      setLoading(false);
    });

    return () => {
      if (imgSrc) URL.revokeObjectURL(imgSrc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = useCallback(async () => {
    await deleteMoment(id);
    router.push("/");
  }, [id, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#080808", color: "#5A8A30" }}
      >
        <span className="cursor-blink">LOADING</span>
      </div>
    );
  }

  if (!moment) return null;

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#080808" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #2A4A15" }}
      >
        <button
          onClick={() => router.push("/")}
          className="text-sm px-3 py-1"
          style={{ color: "#5A8A30", border: "1px solid #2A4A15" }}
        >
          [ ← BACK ]
        </button>
        <span className="text-xs" style={{ color: "#5A8A30" }}>
          {formatDate(moment.createdAt)}
        </span>

        {/* Delete dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="text-sm px-3 py-1"
              style={{ color: "#FF4444", border: "1px solid #FF4444" }}
            >
              [ DEL ]
            </button>
          </DialogTrigger>
          <DialogContent
            style={{
              background: "#0F0F0F",
              border: "1px solid #FF4444",
              fontFamily: "'DungGeunMo', monospace",
            }}
          >
            <DialogHeader>
              <DialogTitle style={{ color: "#FF4444" }}>DELETE ENTRY?</DialogTitle>
              <DialogDescription style={{ color: "#5A8A30" }}>
                이 기록은 영구적으로 삭제됩니다. 되돌릴 수 없습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <DialogTrigger asChild>
                <button
                  className="px-4 py-2 text-sm"
                  style={{ color: "#5A8A30", border: "1px solid #2A4A15" }}
                >
                  [ CANCEL ]
                </button>
              </DialogTrigger>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm"
                style={{ background: "#FF4444", color: "#080808", border: "1px solid #FF4444" }}
              >
                [ CONFIRM DELETE ]
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* Image */}
      {imgSrc && (
        <div className="w-full" style={{ background: "#000" }}>
          <img
            src={imgSrc}
            alt=""
            className="w-full object-contain"
            style={{ maxHeight: "60vh" }}
          />
        </div>
      )}

      {/* Memo */}
      {moment.memo && (
        <div className="p-4 flex-1">
          <div
            className="text-xs mb-2"
            style={{ color: "#5A8A30" }}
          >
            &gt; MEMO_
          </div>
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: "#B6FF6D" }}
          >
            {moment.memo}
          </p>
        </div>
      )}

      {/* No memo + no image */}
      {!moment.memo && !imgSrc && (
        <div className="flex-1 flex items-center justify-center" style={{ color: "#5A8A30" }}>
          <span className="text-xs">// EMPTY ENTRY</span>
        </div>
      )}
    </main>
  );
}
