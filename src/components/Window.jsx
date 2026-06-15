import { useCallback, useEffect, useRef, useState } from "react";

const TOPBAR_HEIGHT = 60;
const DOCK_HEIGHT = 120;

export default function Window({
  win,
  children,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onUpdate,
  isObscured,
}) {
  const [isEntering, setIsEntering] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const prevMinimized = useRef(win.minimized);
  const lastTap = useRef(0);
  const touchStart = useRef(null);
  const [touchDragReady, setTouchDragReady] = useState(false);
  const [snapPreview, setSnapPreview] = useState(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => setIsEntering(false)),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  // Detect restore from minimized
  useEffect(() => {
    if (prevMinimized.current && !win.minimized) {
      setIsRestoring(true);
      const t = setTimeout(() => setIsRestoring(false), 350);
      return () => clearTimeout(t);
    }
    prevMinimized.current = win.minimized;
  }, [win.minimized]);

  const handleClose = useCallback(
    (e) => {
      e.stopPropagation();
      if (isClosing || isMinimizing) return;
      setIsClosing(true);
      setTimeout(onClose, 280);
    },
    [isClosing, isMinimizing, onClose],
  );

  const handleMinimize = useCallback(
    (e) => {
      e.stopPropagation();
      if (isClosing || isMinimizing) return;
      setIsMinimizing(true);
      setTimeout(onMinimize, 280);
    },
    [isClosing, isMinimizing, onMinimize],
  );

  const handleDragStart = useCallback(
    (e) => {
      if (e.button !== 0 || win.maximized) return;
      e.preventDefault();
      onFocus();
      const startX = e.clientX;
      const startY = e.clientY;
      const ox = win.x;
      const oy = win.y;
      let raf = null;

      function onMove(ev) {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const newX = Math.max(
            0,
            Math.min(vw - win.width, ox + (ev.clientX - startX)),
          );
          const newY = Math.max(
            TOPBAR_HEIGHT + 8,
            Math.min(vh - win.height - DOCK_HEIGHT, oy + (ev.clientY - startY)),
          );
          onUpdate({ x: newX, y: newY });

          if (ev.clientX <= 30) setSnapPreview("left");
          else if (ev.clientX >= vw - 30) setSnapPreview("right");
          else setSnapPreview(null);
        });
      }

      function onUp(ev) {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        setSnapPreview(null);
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (ev.clientX <= 30) {
          onUpdate({
            x: 0,
            y: TOPBAR_HEIGHT,
            width: vw / 2,
            height: vh - TOPBAR_HEIGHT - DOCK_HEIGHT,
          });
        } else if (ev.clientX >= vw - 30) {
          onUpdate({
            x: vw / 2,
            y: TOPBAR_HEIGHT,
            width: vw / 2,
            height: vh - TOPBAR_HEIGHT - DOCK_HEIGHT,
          });
        }
      }

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [win, onUpdate, onFocus],
  );

  const handleTitlebarTouch = useCallback(
    (e) => {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        setTouchDragReady((v) => !v);
        lastTap.current = 0;
        return;
      }
      lastTap.current = now;
      if (!touchDragReady || win.maximized) return;
      onFocus();
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY, ox: win.x, oy: win.y };
    },
    [touchDragReady, win, onFocus],
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!touchDragReady || !touchStart.current) return;
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      onUpdate({
        x: Math.max(0, Math.min(vw - win.width, touchStart.current.ox + dx)),
        y: Math.max(
          TOPBAR_HEIGHT + 8,
          Math.min(vh - win.height - DOCK_HEIGHT, touchStart.current.oy + dy),
        ),
      });
    },
    [touchDragReady, win, onUpdate],
  );

  const handleResizeStart = useCallback(
    (e) => {
      if (e.button !== 0 || win.maximized) return;
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const ow = win.width;
      const oh = win.height;
      let raf = null;

      function onMove(ev) {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          onUpdate({
            width: Math.max(260, ow + (ev.clientX - startX)),
            height: Math.max(180, oh + (ev.clientY - startY)),
          });
        });
      }

      function onUp() {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      }
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [win, onUpdate],
  );

  const style = win.maximized
    ? {
        left: 0,
        top: TOPBAR_HEIGHT,
        width: "100%",
        height: `calc(100vh - ${TOPBAR_HEIGHT}px - ${DOCK_HEIGHT}px)`,
        zIndex: win.z,
      }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.z,
      };

  const windowClass = [
    "os-window",
    win.maximized ? "maximized" : "",
    isEntering ? "entering" : "",
    isClosing ? "closing" : "",
    isMinimizing ? "minimizing" : "",
    isRestoring ? "restoring" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={windowClass}
      style={{
        ...style,
        background: isObscured
          ? "rgba(4, 5, 18, 0.97)"
          : "rgba(6, 8, 24, 0.78)",
        backdropFilter: isObscured
          ? "none"
          : "blur(24px) saturate(130%) hue-rotate(5deg)",
        WebkitBackdropFilter: isObscured
          ? "none"
          : "blur(24px) saturate(130%) hue-rotate(5deg)",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
      }}
      onMouseDown={onFocus}
    >
      <div
        className="win-titlebar"
        onMouseDown={handleDragStart}
        onDoubleClick={onToggleMaximize}
        onTouchStart={handleTitlebarTouch}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => {
          touchStart.current = null;
        }}
        style={
          touchDragReady
            ? {
                background: "rgba(147, 112, 219, 0.15)",
                borderBottom: "0.5px solid rgba(147, 112, 219, 0.25)",
              }
            : {}
        }
      >
        <div className="win-btns">
          <button className="win-btn btn-close" onClick={handleClose} />
          <button className="win-btn btn-min" onClick={handleMinimize} />
          <button className="win-btn btn-max" onClick={onToggleMaximize} />
        </div>
        <span className="win-title">
          {touchDragReady ? "✦ drag mode" : win.title}
        </span>
      </div>

      {snapPreview && (
        <div
          style={{
            position: "fixed",
            top: TOPBAR_HEIGHT,
            left: snapPreview === "left" ? 0 : "50%",
            width: "50%",
            height: `calc(100vh - ${TOPBAR_HEIGHT}px - ${DOCK_HEIGHT}px)`,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            pointerEvents: "none",
            zIndex: 99998,
          }}
        />
      )}

      <div className="win-body">{children}</div>
      {!win.maximized && (
        <div className="win-resize" onMouseDown={handleResizeStart} />
      )}
    </div>
  );
}
