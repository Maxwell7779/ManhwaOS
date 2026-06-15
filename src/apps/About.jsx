import { useEffect, useState } from "react";

const TIPS = [
  {
    title: "Wi-Fi Panel",
    desc: "Tap the WiFi icon in the top bar to open the network panel. Connect to any network — some are more suspicious than others.",
  },
  {
    title: "ORV Soundtrack",
    desc: "Tap the Bluetooth icon in the top bar to open the music player. Play, pause, skip, and scrub through the ORV OST.",
  },
  {
    title: "Drag & Snap Windows",
    desc: "On desktop, drag any window by its titlebar. Drag to the left or right edge of the screen to snap it to half the screen.",
  },
  {
    title: "Mobile Drag",
    desc: "On mobile, double-tap a window's titlebar to enter drag mode (it glows purple). Then drag it anywhere. Double-tap again to lock it.",
  },
  {
    title: "Resize Windows",
    desc: "On desktop, grab the triangle handle in the bottom-right corner of any window to resize it freely.",
  },
  {
    title: "Desktop Pet",
    desc: "The little pixel cat in the corner is draggable. On desktop just click and drag. On mobile just touch and drag it anywhere.",
  },
  {
    title: "Search",
    desc: "Use the search bar to open any app instantly, or search for a manhwa title to find it on MangaDex.",
  },
  {
    title: "About ManhwaOS",
    desc: "Built with React + Vite. Wallpaper from LifeScapes Visual (ORV). A hangout spot for manhwa fans. v1.0",
  },
];

export default function AboutApp() {
  const [visible, setVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="about-app"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <h2 style={{ marginBottom: 4 }}>How to use ManhwaOS</h2>
      <span className="about-badge">v1.0 · Web Desktop</span>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginTop: 12,
        }}
      >
        {TIPS.map((tip, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(activeIdx === i ? null : i)}
            style={{
              background:
                activeIdx === i
                  ? "rgba(147, 112, 219, 0.12)"
                  : "rgba(255, 255, 255, 0.03)",
              border: `0.5px solid ${
                activeIdx === i
                  ? "rgba(147, 112, 219, 0.3)"
                  : "rgba(255, 255, 255, 0.07)"
              }`,
              borderRadius: 10,
              padding: "9px 12px",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.15s, border-color 0.15s",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>{tip.icon}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: "IBM Plex Sans, system-ui, sans-serif",
                }}
              >
                {tip.title}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 10,
                  color: "rgba(147,112,219,0.7)",
                  transition: "transform 0.2s",
                  transform:
                    activeIdx === i ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▾
              </span>
            </div>

            {activeIdx === i && (
              <p
                style={{
                  margin: "8px 0 2px 24px",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.6,
                  fontFamily: "IBM Plex Sans, system-ui, sans-serif",
                }}
              >
                {tip.desc}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
