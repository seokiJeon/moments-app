"use client";

import { useState, useEffect } from "react";

export default function Taskbar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const yyyy = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
      setDate(`${yyyy}-${mo}-${dd}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center justify-between flex-shrink-0"
      style={{
        height: "36px",
        background: "#0F0F0F",
        borderTop: "2px solid #B6FF6D",
        padding: "0 8px",
        boxShadow: "0 -4px 16px rgba(182,255,109,0.08)",
      }}
    >
      {/* Start button */}
      <button
        style={{
          background: "#B6FF6D",
          color: "#080808",
          border: "1px solid rgba(0,0,0,0.5)",
          padding: "2px 10px",
          fontSize: "12px",
          fontFamily: "'DungGeunMo', monospace",
          fontWeight: "bold",
          cursor: "default",
        }}
      >
        ▐▌ MOMENTS
      </button>

      {/* Active window chip */}
      <div
        style={{
          border: "1px solid #B6FF6D",
          padding: "1px 10px",
          fontSize: "11px",
          color: "#B6FF6D",
          background: "#111611",
        }}
      >
        MOMENTS_LOG.db
      </div>

      {/* Clock */}
      <div
        className="flex flex-col items-end"
        style={{
          border: "1px solid #2A4A15",
          padding: "1px 8px",
          color: "#B6FF6D",
          fontSize: "11px",
          lineHeight: "1.2",
          minWidth: "80px",
          textAlign: "right",
        }}
      >
        <span>{time}</span>
        <span style={{ color: "#5A8A30", fontSize: "10px" }}>{date}</span>
      </div>
    </div>
  );
}
