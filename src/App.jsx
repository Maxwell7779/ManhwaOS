import { useState, useRef } from "react";
import Taskbar from "./components/Taskbar";
import Desktop from "./components/Desktop";
import Window from "./components/Window";
import Dock from "./components/Dock";
import WelcomeApp from "./apps/welcome";
import ClockApp from "./apps/clock";
import ManhwaApp from "./apps/manhwa";
import AboutApp from "./apps/about";
import "./App.css";
import Pet from "./components/Pet";
import SearchBar from "./components/searchBar";
import VisitorCount from "./components/visitorCount";
import BootScreen from "./components/bootscreen";

const APP_REGISTRY = {
  welcome: {
    title: "Welcome to ManhwaOS",
    component: WelcomeApp,
    width: 340,
    height: 460,
  },

  clock: { title: "Clock", component: ClockApp, width: 220, height: 260 },
  manhwa: {
    title: "Read Manhwa",
    component: ManhwaApp,
    width: 320,
    height: 320,
  },

  about: { title: "About", component: AboutApp, width: 300, height: 260 },
};

export default function App() {
  const [windows, setWindows] = useState([]);
  const [booting, setBooting] = useState(true);
  const nextId = useRef(1);
  const nextZ = useRef(100);

  function findOpenPosition(appKey, width, height, existingWindows) {
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1280;

    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 760;

    const clampX = (x) => Math.max(24, Math.min(x, viewportWidth - width - 24));

    const clampY = (y) =>
      Math.max(56, Math.min(y, viewportHeight - height - 56));

    const centerX = clampX((viewportWidth - width) / 2);

    const centerY = clampY((viewportHeight - height) / 2);

    const keyOffsets = {
      welcome: { dx: 0, dy: 0 },
      clock: { dx: 260, dy: -120 },
      manhwa: { dx: -260, dy: -10 },
      about: { dx: 0, dy: 220 },
    };

    const initial = keyOffsets[appKey] || { dx: 0, dy: 0 };

    const startX = clampX(centerX + initial.dx);

    const startY = clampY(centerY + initial.dy);

    const padding = 24;
    const overlaps = (x, y, win) =>
      !(
        x + width + padding < win.x ||
        x > win.x + win.width + padding ||
        y + height + padding < win.y ||
        y > win.y + win.height + padding
      );

    const isFree = (x, y) =>
      !existingWindows.some((win) => overlaps(x, y, win));

    if (isFree(startX, startY)) {
      return { x: startX, y: startY };
    }

    const searchOffsets = [
      { dx: 0, dy: 0 },
      { dx: 0, dy: -120 },
      { dx: 120, dy: 0 },
      { dx: 0, dy: 120 },
      { dx: -120, dy: 0 },
      { dx: 120, dy: -120 },
      { dx: -120, dy: -120 },
      { dx: 120, dy: 120 },
      { dx: -120, dy: 120 },
      { dx: 0, dy: -240 },
      { dx: 240, dy: 0 },
      { dx: 0, dy: 240 },
      { dx: -240, dy: 0 },
    ];

    for (const offset of searchOffsets) {
      const x = clampX(centerX + offset.dx);
      const y = clampY(centerY + offset.dy);
      if (isFree(x, y)) {
        return { x, y };
      }
    }

    return { x: centerX, y: centerY };
  }

  function openApp(appKey) {
    const existing = windows.find((w) => w.appKey === appKey && !w.minimized);
    if (existing) {
      focusWindow(existing.id);
      return;
    }
    const minimized = windows.find((w) => w.appKey === appKey && w.minimized);
    if (minimized) {
      restoreWindow(minimized.id);
      return;
    }

    const def = APP_REGISTRY[appKey];
    const id = nextId.current++;
    const z = nextZ.current++;
    const pos = findOpenPosition(
      appKey,
      def.width,
      def.height,
      windows.filter((w) => !w.minimized),
    );

    setWindows((prev) => [
      ...prev,
      {
        id,
        appKey,
        title: def.title,
        x: pos.x,
        y: pos.y,

        width: def.width,
        height: def.height,
        z,
        minimized: false,
        maximized: false,
      },
    ]);
  }

  function closeWindow(id) {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }

  function minimizeWindow(id) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );
  }

  function restoreWindow(id) {
    const z = nextZ.current++;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: false, z } : w)),
    );
  }

  function toggleMaximize(id) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    );
  }

  function focusWindow(id) {
    const z = nextZ.current++;
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z } : w)));
  }

  function updateWindow(id, changes) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...changes } : w)),
    );
  }

  return (
    <div className="os-root">
      {booting && <BootScreen onDone={() => setBooting(false)} />}
      <div className="wallpaper">
        <img src="/download2.jfif" alt="" draggable="false" />
      </div>
      <div className="wallpaper-overlay" />
      <a
        href="https://ph.pinterest.com/lifescapesvisual/"
        target="_blank"
        rel="noopener noreferrer"
        className="wallpaper-credit"
      >
        {" "}
        © LifeScapes Visual{" "}
      </a>
      /* h1 change later */
      <div className="hero-title">
        <div>
          <h1>ManhwaOS</h1>
          <p>A manwha lovers hangout spot</p>
        </div>
      </div>
      <Taskbar onOpenApp={openApp} />
      <SearchBar onOpenApp={openApp} />
      <Desktop>
        {windows.map((win) => {
          if (win.minimized) return null;
          const { component: AppComponent } = APP_REGISTRY[win.appKey];
          return (
            <Window
              key={win.id}
              win={win}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onToggleMaximize={() => toggleMaximize(win.id)}
              onFocus={() => focusWindow(win.id)}
              onUpdate={(changes) => updateWindow(win.id, changes)}
            >
              <AppComponent />
            </Window>
          );
        })}
      </Desktop>
      <Pet />
      <VisitorCount />
      <div className="footer">
        <p>
          Made with ❤️ by{" MEEEE "}
          <a href="https://github.com/ManhwaOS" target="_blank">
            ManhwaOS Team
          </a>
        </p>
      </div>
      <Dock
        windows={windows}
        onOpenApp={openApp}
        onRestore={restoreWindow}
        onFocus={focusWindow}
      />
    </div>
  );
}
