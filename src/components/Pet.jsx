export default function Pet() {
  return (
    <img
      src="/gif.gif"
      alt="pet"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9000,
        pointerEvents: "none",
        width: 64,
        height: 64,
        imageRendering: "pixelated",
        userSelect: "none",
        mixBlendMode: "screen",
      }}
    />
  );
}
