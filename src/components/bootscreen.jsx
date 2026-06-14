import { useState, useEffect, useRef } from "react";

export default function BootScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const doneRef = useRef(false);

  const msgs = [
    "Initializing Star Stream...",
    "Loading constellations...",
    "Summoning Kim Dokja...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          if (!doneRef.current) {
            doneRef.current = true;
            setTimeout(() => setFading(true), 0);
            setTimeout(onDone, 600);
          }
          return 100;
        }
        return p + 1.5;
      });
    }, 35);
    return () => clearInterval(interval);
  }, [onDone]);

  useEffect(() => {
    const t = setInterval(() => {
      setMsgIdx((i) => (i + 1) % msgs.length);
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`boot-root${fading ? " boot-fading" : ""}`}>
      <div className="boot-hero">
        <div className="boot-hero-inner">
          <h1 className="boot-title">ManhwaOS</h1>
          <p className="boot-subtitle">A manhwa lovers hangout spot</p>
        </div>
      </div>
      <div className="boot-loader">
        <div className="boot-status">{msgs[msgIdx]}</div>
        <div className="boot-bar-shell">
          <div className="boot-bar-track">
            <div className="boot-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="boot-version">v1.0</div>
      </div>
    </div>
  );
}
