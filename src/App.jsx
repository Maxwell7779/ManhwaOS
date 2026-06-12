import { useState, useRef, useEffect } from "react";
import Taskbar from "./components/Taskbar";
import Desktop from "./components/Desktop";
import Window from "./components/Window";
import Dock from "./components/Dock";
import WelcomeApp from "./apps/Welcome";
import ClockApp from "./apps/Clock";
import ManhwaApp from "./apps/Manhwa";
import AboutApp from "./apps/About";
import "./App.css";

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
  const nextId = useRef(1);
  const nextZ = useRef(100);

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

    setWindows((prev) => [
      ...prev,
      {
        id,
        appKey,
        title: def.title,
        x: 80 + prev.length * 30,
        y: 80 + prev.length * 30,
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

  useEffect(() => {
    openApp("welcome");
    setTimeout(() => openApp("clock"), 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="os-root">
      <div className="wallpaper">
        <img src="/download.jfif" alt="" draggable="false" />
      </div>
      <div className="wallpaper-overlay" />
      <Taskbar />
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
      <Dock
        windows={windows}
        onOpenApp={openApp}
        onRestore={restoreWindow}
        onFocus={focusWindow}
      />
    </div>
  );
}
