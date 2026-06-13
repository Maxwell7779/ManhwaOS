import { useState, useEffect, useRef } from "react";
import { Wifi, Bluetooth } from "lucide-react";

const FAKE_NETWORKS = [
  { name: "ManhwaOSWiFi", strength: 4, secured: true },
  { name: "KimDokja5G", strength: 3, secured: true },
  { name: "YooJoonghyukWiFi", strength: 3, secured: true },
  { name: "HanSooyoungNet", strength: 2, secured: true },
  { name: "STARDUSTPLSSS", strength: 1, secured: false },
  { name: "hehehe", strength: 2, secured: false },
];

const ORV_TRACKS = [
  { title: "LetTheSKyFALLL", src: "/orv1.mp3" },
  { title: "Unknown Track", src: "/orv2.mp3" },
  { title: "Unknown Track", src: "/orv3.mp3" },
];

function SignalBars({ strength }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        gap: "2px",
        height: "14px",
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          style={{
            width: "3px",
            borderRadius: "1px",
            height: `${4 + i * 2.5}px`,
            background:
              i <= strength
                ? "rgba(147,112,219,0.9)"
                : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </span>
  );
}

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Taskbar() {
  const [now, setNow] = useState(new Date());
  const [wifiOpen, setWifiOpen] = useState(false);
  const [btOpen, setBtOpen] = useState(false);

  const [connectedWifi, setConnectedWifi] = useState(null);
  const [playing, setPlaying] = useState(false);

  const [trackIdx, setTrackIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function handle(e) {
      if (!e.target.closest(".tb-dropdown-wrap")) {
        setWifiOpen(false);
        setBtOpen(false);
      }
    }

    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  function prevTrack() {
    const idx = (trackIdx - 1 + ORV_TRACKS.length) % ORV_TRACKS.length;
    setTrackIdx(idx);
    setPlaying(false);
    setCurrentTime(0);
    setTimeout(() => {
      audioRef.current?.play();
      setPlaying(true);
    }, 50);
  }

  function nextTrack() {
    const idx = (trackIdx + 1) % ORV_TRACKS.length;
    setTrackIdx(idx);
    setPlaying(false);
    setCurrentTime(0);
    setTimeout(() => {
      audioRef.current?.play();
      setPlaying(true);
    }, 50);
  }

  function handleSeek(e) {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = x * duration;
    setCurrentTime(x * duration);
  }

  const date = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const time = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="taskbar">
      <span className="taskbar-logo">ManhwaOS</span>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="taskbar-clock">
          {date} · {time}
        </span>

        <div className="taskbar-icons">
          <div className="tb-dropdown-wrap">
            <button
              className={`tb-icon-btn${wifiOpen ? " active" : ""}`}
              onClick={() => {
                setWifiOpen((o) => !o);
                setBtOpen(false);
              }}
              title="WiFi"
            >
              <Wifi size={14} />
            </button>

            {wifiOpen && (
              <div className="tb-dropdown">
                <div className="tb-dropdown-header">
                  <Wifi size={14} /> Wi-Fi
                </div>

                <div className="tb-dropdown-section-label">
                  AVAILABLE NETWORKS
                </div>

                {FAKE_NETWORKS.map((net) => (
                  <button
                    key={net.name}
                    className={`tb-network-row${connectedWifi === net.name ? " connected" : ""}`}
                    onClick={() => setConnectedWifi(net.name)}
                  >
                    <span className="tb-network-name">
                      {net.secured ? "🔒 " : "🌐 "}
                      {net.name}
                    </span>

                    <SignalBars strength={net.strength} />
                  </button>
                ))}

                {connectedWifi && (
                  <div className="tb-dropdown-connected">
                    Connected: <strong>{connectedWifi}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="tb-dropdown-wrap">
            <button
              className={`tb-icon-btn${btOpen ? " active" : ""}`}
              onClick={() => {
                setBtOpen((o) => !o);
                setWifiOpen(false);
              }}
              title="Bluetooth"
            >
              <Bluetooth size={14} />
            </button>
            {btOpen && (
              <div className="tb-dropdown tb-dropdown-bt">
                <div className="tb-dropdown-header">
                  <Bluetooth size={14} /> ORV Soundtrack
                </div>

                <div className="tb-track-info">
                  <div className="tb-track-title">
                    {ORV_TRACKS[trackIdx].title}
                  </div>

                  <div className="tb-track-sub">
                    Omniscient Reader's Viewpoint OST
                  </div>
                </div>
                <div className="tb-progress-wrap" onClick={handleSeek}>
                  <div className="tb-progress-bg">
                    <div
                      className="tb-progress-fill"
                      style={{ width: `${progress}%` }}
                    />

                    <div
                      className="tb-progress-thumb"
                      style={{ left: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="tb-progress-times">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="tb-player-controls">
                  <button className="tb-ctrl-btn" onClick={prevTrack}>
                    ⏮
                  </button>

                  <button
                    className="tb-ctrl-btn tb-play-btn"
                    onClick={togglePlay}
                  >
                    {playing ? "⏸" : "▶"}
                  </button>

                  <button className="tb-ctrl-btn" onClick={nextTrack}>
                    ⏭
                  </button>
                </div>

                <div className="tb-track-list">
                  {ORV_TRACKS.map((t, i) => (
                    <button
                      key={t.title}
                      className={`tb-track-row${i === trackIdx ? " active" : ""}`}
                      onClick={() => {
                        setTrackIdx(i);

                        setPlaying(false);
                        setCurrentTime(0);
                        setTimeout(() => {
                          audioRef.current?.play();

                          setPlaying(true);
                        }, 50);
                      }}
                    >
                      {i === trackIdx && playing ? "▶ " : "    "}
                      {t.title}
                    </button>
                  ))}
                </div>

                <audio
                  ref={audioRef}
                  src={ORV_TRACKS[trackIdx].src}
                  onEnded={nextTrack}
                  onTimeUpdate={() =>
                    setCurrentTime(audioRef.current?.currentTime || 0)
                  }
                  onLoadedMetadata={() =>
                    setDuration(audioRef.current?.duration || 0)
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
