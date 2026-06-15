import { useState, useEffect, useRef } from "react";
import { Wifi, Bluetooth } from "lucide-react";
import { supabase } from "../lib/supabase";

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
            transition: "background 0.3s ease",
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

function Dropdown({ open, children }) {
  return (
    <div
      className={`tb-dropdown-panel${open ? " tb-dropdown-panel--open" : ""}`}
    >
      {children}
    </div>
  );
}

export default function Taskbar({ onOpenApp }) {
  const [now, setNow] = useState(new Date());
  const [wifiOpen, setWifiOpen] = useState(false);
  const [btOpen, setBtOpen] = useState(false);
  const [connectedWifi, setConnectedWifi] = useState(null);
  const [connectingWifi, setConnectingWifi] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [visitorCount, setVisitorCount] = useState(null);

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

  useEffect(() => {
    async function fetchCount() {
      try {
        const { data, error } = await supabase.rpc("increment_visitors");
        if (!error && data !== null) setVisitorCount(data);
        else setVisitorCount("?");
      } catch {
        setVisitorCount("?");
      }
    }
    fetchCount();
  }, []);

  function handleConnectWifi(name) {
    if (connectedWifi === name) return;
    setConnectingWifi(name);
    setTimeout(() => {
      setConnectedWifi(name);
      setConnectingWifi(null);
    }, 1200);
  }

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

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const date = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="taskbar">
      <button
        className="taskbar-logo taskbar-logo-btn"
        onClick={() => onOpenApp("welcome")}
        title="Welcome"
      >
        ManhwaOS
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="taskbar-clock">
          {date} · {time}
        </span>

        {visitorCount !== null && (
          <span className="taskbar-visitor">
            <span>
              {typeof visitorCount === "number"
                ? visitorCount.toLocaleString()
                : visitorCount}
            </span>{" "}
            visitors
          </span>
        )}

        <div className="taskbar-icons">
          {/* WiFi */}
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

            <Dropdown open={wifiOpen}>
              <div className="tb-dropdown tb-dropdown--wifi">
                <div className="tb-dropdown-header">
                  <Wifi size={13} />
                  <span>Wi-Fi</span>
                  <span className="tb-header-pill">On</span>
                </div>

                {connectedWifi && (
                  <div className="tb-connected-banner">
                    <span className="tb-connected-dot" />
                    <span>{connectedWifi}</span>
                    <span
                      style={{ marginLeft: "auto", fontSize: 10, opacity: 0.4 }}
                    >
                      Connected
                    </span>
                  </div>
                )}

                <div className="tb-dropdown-section-label">
                  AVAILABLE NETWORKS
                </div>

                {FAKE_NETWORKS.map((net) => (
                  <button
                    key={net.name}
                    className={`tb-network-row${connectedWifi === net.name ? " connected" : ""}${connectingWifi === net.name ? " connecting" : ""}`}
                    onClick={() => handleConnectWifi(net.name)}
                  >
                    <span className="tb-network-name">
                      {net.secured ? "🔒 " : "🌐 "}
                      {net.name}
                    </span>
                    {connectingWifi === net.name ? (
                      <span className="tb-spinner" />
                    ) : (
                      <SignalBars strength={net.strength} />
                    )}
                  </button>
                ))}
              </div>
            </Dropdown>
          </div>

          {/* Bluetooth / Music */}
          <div className="tb-dropdown-wrap">
            <button
              className={`tb-icon-btn${btOpen ? " active" : ""}${playing ? " tb-icon-btn--playing" : ""}`}
              onClick={() => {
                setBtOpen((o) => !o);
                setWifiOpen(false);
              }}
              title="Music"
            >
              <Bluetooth size={14} />
              {playing && <span className="tb-playing-dot" />}
            </button>

            <Dropdown open={btOpen}>
              <div className="tb-dropdown tb-dropdown-bt">
                <div className="tb-dropdown-header">
                  <Bluetooth size={13} />
                  <span>ORV Soundtrack</span>
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
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
