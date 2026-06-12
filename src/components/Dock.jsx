import { BookMarked, BookOpen, Clock, GlassesIcon } from "lucide-react";

const DOCK_APPS = [
  { key: "welcome", label: "Welcome", icon: <BookMarked size={28} /> },
  { key: "clock", label: "Clock", icon: <Clock size={28} /> },
  { key: "manhwa", label: "Manhwa", icon: <BookOpen size={28} /> },
  { key: "about", label: "About", icon: <GlassesIcon size={28} /> },
];

export default function Dock({ windows, onOpenApp, onRestore, onFocus }) {
  function handleClick(appKey) {
    const win = windows.find((w) => w.appKey === appKey);
    if (win && win.minimized) onRestore(win.id);
    else if (win) onFocus(win.id);
    else onOpenApp(appKey);
  }

  return (
    <div className="dock">
      {DOCK_APPS.map((app) => {
        const isOpen = windows.some((w) => w.appKey === app.key);
        return (
          <button
            key={app.key}
            className={`dock-icon${isOpen ? " open" : ""}`}
            title={app.label}
            onClick={() => handleClick(app.key)}
          >
            <span className="dock-icon-inner">{app.icon}</span>
            <span className={`dock-dot${isOpen ? "" : " hidden"}`} />
          </button>
        );
      })}
    </div>
  );
}
