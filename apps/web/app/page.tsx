import RetroWindow from "@/components/shared/RetroWindow";
import Taskbar from "@/components/shared/Taskbar";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        // Desktop background: dark with subtle phosphor dot grid
        background: "#050505",
        backgroundImage: "radial-gradient(rgba(182,255,109,0.15) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Desktop area: window lives here */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <RetroWindow title="MOMENTS_LOG.db">
          <GalleryGrid />
        </RetroWindow>
      </div>

      {/* Fixed taskbar at bottom */}
      <Taskbar />
    </div>
  );
}
