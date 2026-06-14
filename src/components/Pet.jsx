export default function Pet() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 90,
        right: 12,
        zIndex: 9000,
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px) saturate(140%)",
        WebkitBackdropFilter: "blur(12px) saturate(140%)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 16,
        padding: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        pointerEvents: "none",
      }}
    >
      <img
        src="/gif.gif"
        alt="pet"
        style={{
          width: 48,
          height: 48,
          imageRendering: "pixelated",
          userSelect: "none",
          display: "block",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
