import { useEffect, useRef, useState } from "react";

export default function Pet() {
  const posRef = useRef({ x: 200, y: 200 });
  const velRef = useRef({ x: 1.5, y: 0.8 });
  const [pos, setPos] = useState({ x: 200, y: 200 });
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const vel = velRef.current;
      let nx = posRef.current.x + vel.x;
      let ny = posRef.current.y + vel.y;

      const maxX = window.innerWidth - 80;
      const maxY = window.innerHeight - 80;

      if (nx <= 0 || nx >= maxX) vel.x *= -1;
      if (ny <= 40 || ny >= maxY) vel.y *= -1;

      nx = Math.max(0, Math.min(maxX, nx));
      ny = Math.max(40, Math.min(maxY, ny));

      posRef.current = { x: nx, y: ny };
      setPos({ x: nx, y: ny });
      setDir(vel.x > 0 ? 1 : -1);
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src="/gif.gif"
      alt="pet"
      style={{
        position: "fixed",
        bottom: 80,
        right: 40,
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
