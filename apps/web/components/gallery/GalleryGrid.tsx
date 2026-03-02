"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getAllMoments, type Moment } from "@/lib/db";
import { createObjectURL, formatMonthHeader, formatDayLabel } from "@/lib/image";

interface GroupedMoments {
  month: string;
  items: Moment[];
}

function groupByMonth(moments: Moment[]): GroupedMoments[] {
  const map = new Map<string, Moment[]>();
  for (const m of moments) {
    const key = formatMonthHeader(m.createdAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return Array.from(map.entries()).map(([month, items]) => ({ month, items }));
}

// ── Folder-shaped card ──────────────────────────────────────────
function FolderCard({ moment }: { moment: Moment }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (moment.thumbBlob) {
      const url = createObjectURL(moment.thumbBlob);
      setSrc(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [moment.thumbBlob]);

  const dayLabel = formatDayLabel(moment.createdAt);

  return (
    <Link href={`/moment/${moment.id}`}>
      <div className="group cursor-pointer">

        {/* Folder tab — labeled ear with date */}
        <div
          style={{
            width: "55%",
            height: "20px",
            background: "#1A3010",
            border: "1px solid #B6FF6D",
            borderBottom: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            paddingLeft: "6px",
          }}
        >
          <span style={{ color: "#5A8A30", fontSize: "8px", lineHeight: 1 }}>■</span>
          <span
            style={{
              color: "#B6FF6D",
              fontSize: "12px",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            {dayLabel}
          </span>
        </div>

        {/* Folder body */}
        <div
          style={{
            border: "1px solid #B6FF6D",
            background: "#0C1008",
            overflow: "hidden",
            position: "relative",
            aspectRatio: "1",
          }}
        >
          {src ? (
            /* Photo entry */
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover transition-opacity group-hover:opacity-75"
            />
          ) : (
            /* Text-only entry — memo look */
            <div className="w-full h-full flex flex-col p-2 gap-1">
              <div style={{ color: "#2A4A15", fontSize: "9px", letterSpacing: "0.05em" }}>
                ┌─ 메모 ─
              </div>
              <p
                style={{
                  color: "#B6FF6D",
                  fontSize: "11px",
                  lineHeight: "1.5",
                  display: "-webkit-box",
                  WebkitLineClamp: 6,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {moment.memo ?? ""}
              </p>
            </div>
          )}

          {/* Hover: phosphor border glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              border: "2px solid #B6FF6D",
              boxShadow: "inset 0 0 12px rgba(182,255,109,0.18)",
            }}
          />
        </div>
      </div>
    </Link>
  );
}

// ── Alert-box empty state ────────────────────────────────────────
function EmptyAlert() {
  return (
    <div className="flex items-center justify-center h-full py-20">
      <div
        style={{
          border: "1px solid #B6FF6D",
          minWidth: "280px",
          maxWidth: "340px",
          boxShadow: "4px 4px 0 #2A4A15",
        }}
      >
        <div
          style={{
            background: "#B6FF6D",
            color: "#080808",
            padding: "3px 8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          <span>⚠</span>
          <span>MOMENTS_LOG.db</span>
        </div>
        <div
          style={{
            background: "#0F0F0F",
            padding: "20px 16px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#B6FF6D", fontSize: "13px" }}>NO RECORDS FOUND</p>
          <p style={{ color: "#5A8A30", fontSize: "11px", lineHeight: "1.6" }}>
            기록이 없습니다.
            <br />
            상단 커맨드바에서 첫 순간을 저장하세요.
          </p>
          <div style={{ color: "#5A8A30", fontSize: "11px" }}>
            C:\MOMENTS_LOG\&gt; <span style={{ color: "#B6FF6D" }}>[ + 새 순간 기록 ]</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Gallery ──────────────────────────────────────────────────────
export default function GalleryGrid() {
  const [groups, setGroups] = useState<GroupedMoments[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const all = await getAllMoments();
    setGroups(groupByMonth(all));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const handler = () => load();
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48" style={{ color: "#5A8A30", fontSize: "12px" }}>
        <span className="cursor-blink">LOADING</span>
      </div>
    );
  }

  if (groups.length === 0) return <EmptyAlert />;

  return (
    <div className="flex flex-col gap-6 py-4 pb-6">
      {groups.map((group) => (
        <section key={group.month}>
          {/* Month divider */}
          <div
            className="flex items-center gap-2 mb-3 px-3"
            style={{ color: "#5A8A30", fontSize: "11px" }}
          >
            <span>▶ {group.month}</span>
            <div className="flex-1 h-px" style={{ background: "#2A4A15" }} />
            <span>{group.items.length} entries</span>
          </div>

          {/* Folder grid — gap-x:1px, gap-y:8px (room for date label) */}
          <div
            className="grid grid-cols-3 px-3"
            style={{ gap: "8px 1px" }}
          >
            {group.items.map((moment) => (
              <FolderCard key={moment.id} moment={moment} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
