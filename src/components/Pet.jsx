import { useState, useRef } from "react";

export default function Pet() {
  const [pos, setPos] = useState({ bottom: 90, right: 16 });
  const dragStart = useRef(null);

  function handleTouchStart(e) {
    e.preventDefault();
    const t = e.touches[0];
    dragStart.current = {
      x: t.clientX,
      y: t.clientY,
      bottom: pos.bottom,
      right: pos.right,
    };
  }

  function handleTouchMove(e) {
    e.preventDefault();
    if (!dragStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - dragStart.current.x;
    const dy = t.clientY - dragStart.current.y;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setPos({
      right: Math.max(8, Math.min(vw - 72, dragStart.current.right - dx)),
      bottom: Math.max(8, Math.min(vh - 72, dragStart.current.bottom - dy)),
    });
  }

  function handleMouseDown(e) {
    e.preventDefault();
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      bottom: pos.bottom,
      right: pos.right,
    };
    function onMove(ev) {
      const dx = ev.clientX - dragStart.current.x;
      const dy = ev.clientY - dragStart.current.y;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setPos({
        right: Math.max(8, Math.min(vw - 72, dragStart.current.right - dx)),
        bottom: Math.max(8, Math.min(vh - 72, dragStart.current.bottom - dy)),
      });
    }
    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      dragStart.current = null;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <img
      src="/gif.gif"
      alt="pet"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => {
        dragStart.current = null;
      }}
      style={{
        position: "fixed",
        bottom: pos.bottom,
        right: pos.right,
        zIndex: 9000,
        width: 64,
        height: 64,
        imageRendering: "pixelated",
        userSelect: "none",
        cursor: "grab",
        mixBlendMode: "screen",
        touchAction: "none",
      }}
    />
  );
}
