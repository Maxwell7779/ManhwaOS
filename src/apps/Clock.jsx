import { useState, useEffect } from "react";

export default function ClockApp() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const s = now.getSeconds(),
    m = now.getMinutes(),
    h = now.getHours();

  const sDeg = s * 6 - 90;

  const mDeg = m * 6 + s * 0.1 - 90;
  const hDeg = h * 30 + m * 0.5 - 90;

  function handEnd(deg, len) {
    const r = (deg * Math.PI) / 180;
    return { x: 60 + len * Math.cos(r), y: 60 + len * Math.sin(r) };
  }

  const sh = handEnd(hDeg, 28),
    sm = handEnd(mDeg, 38),
    ss = handEnd(sDeg, 42);

  return (
    <div className="clock-app">
      <svg viewBox="0 0 120 120" width="130" height="130">
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />

        {[...Array(12)].map((_, i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180;
          const r1 = i % 3 === 0 ? 46 : 49;

          return (
            <line
              key={i}
              x1={60 + r1 * Math.cos(a)}
              y1={60 + r1 * Math.sin(a)}
              x2={60 + 54 * Math.cos(a)}
              y2={60 + 54 * Math.sin(a)}
              stroke={`rgba(255,255,255,${i % 3 === 0 ? 0.5 : 0.2})`}
              strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
            />
          );
        })}

        <line
          x1="60"
          y1="60"
          x2={sh.x}
          y2={sh.y}
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <line
          x1="60"
          y1="60"
          x2={sm.x}
          y2={sm.y}
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <line
          x1="60"
          y1="60"
          x2={ss.x}
          y2={ss.y}
          stroke="rgba(147,112,219,0.9)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        <circle cx="60" cy="60" r="3" fill="rgba(147,112,219,0.9)" />
      </svg>

      <div className="clock-digital">
        {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:
        {String(s).padStart(2, "0")}
      </div>

      <div className="clock-date">
        {now.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </div>
  );
}
