"use client";

import Link from "next/link";

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
}

export default function RetroWindow({ title, children }: RetroWindowProps) {
  return (
    <div
      className="flex flex-col"
      style={{
        height: "100%",
        border: "1px solid #B6FF6D",
        boxShadow: "0 0 20px rgba(182,255,109,0.12)",
      }}
    >
      {/* ── Title bar ── */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{ background: "#B6FF6D", color: "#080808", padding: "3px 6px" }}
      >
        <span style={{ fontWeight: "bold", letterSpacing: "0.05em" }}>▌ {title}</span>
        <div className="flex gap-1">
          {["_", "□", "✕"].map((c) => (
            <span
              key={c}
              style={{
                border: "1px solid rgba(0,0,0,0.4)",
                padding: "0 5px",
                fontSize: "10px",
                cursor: "default",
                userSelect: "none",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── Menu bar ── */}
      <div
        className="flex gap-4 flex-shrink-0"
        style={{
          borderBottom: "1px solid #2A4A15",
          padding: "2px 10px",
          color: "#5A8A30",
          fontSize: "12px",
        }}
      >
        {["File", "View", "Help"].map((m) => (
          <span key={m} style={{ cursor: "default" }}>{m}</span>
        ))}
      </div>

      {/* ── Command bar (NEW ENTRY) ── */}
      <Link href="/create" style={{ display: "block", flexShrink: 0 }}>
        <div
          className="flex items-center gap-2"
          style={{
            borderBottom: "1px solid #2A4A15",
            padding: "5px 10px",
            background: "#0A0A0A",
            cursor: "pointer",
            transition: "background 0.1s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "#111611";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "#0A0A0A";
          }}
        >
          <span style={{ color: "#5A8A30", fontSize: "12px", userSelect: "none" }}>
            C:\MOMENTS_LOG\&gt;
          </span>
          {/* Blinking cursor — draws the eye to this bar */}
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "16px",
              background: "#B6FF6D",
              verticalAlign: "middle",
              animation: "blink 1s step-end infinite",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: "#B6FF6D",
              fontSize: "13px",
              fontWeight: "bold",
              letterSpacing: "0.05em",
              userSelect: "none",
            }}
          >
            [ + 새 순간 기록 ]
          </span>
        </div>
      </Link>

      {/* ── Content (scrollable) ── */}
      <div className="flex-1 overflow-y-auto" style={{ background: "#080808" }}>
        {children}
      </div>

      {/* ── Status bar ── */}
      <div
        className="flex justify-between flex-shrink-0"
        style={{
          borderTop: "1px solid #2A4A15",
          padding: "2px 10px",
          fontSize: "11px",
          color: "#5A8A30",
          background: "#0A0A0A",
        }}
      >
        <span>Ready</span>
        <span>■ OFFLINE · LOCAL ONLY</span>
      </div>
    </div>
  );
}
