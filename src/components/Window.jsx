import { useCallback, useEffect, useRef, useState } from "react";

export default function Window({
  win,
  children,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onUpdate,
}) {
  const [isEntering, setIsEntering] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [snapPreview, setSnapPreview] = useState(null);
  const [touchDragReady, setTouchDragReady] = useState(false);
  const touchStart = useRef(null);
  const lastTap = useRef(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsEntering(false));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleClose = useCallback(
    (e) => {
      e.stopPropagation();
      if (isClosing || isMinimizing) return;
      setIsClosing(true);
      window.setTimeout(onClose, 180);
    },
    [isClosing, isMinimizing, onClose],
  );

  const handleMinimize = useCallback(
    (e) => {
      e.stopPropagation();
      if (isClosing || isMinimizing) return;
      setIsMinimizing(true);
      window.setTimeout(onMinimize, 180);
    },
    [isClosing, isMinimizing, onMinimize],
  );

  // Desktop drag
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
        if (raf) window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(() => {
          onUpdate({
            x: ox + (ev.clientX - startX),
            y: Math.max(72, oy + (ev.clientY - startY)),
          });
          const vw = window.innerWidth;
          if (ev.clientX <= 30) setSnapPreview("left");
          else if (ev.clientX >= vw - 30) setSnapPreview("right");
          else setSnapPreview(null);
        });
      }

      function onUp(ev) {
        if (raf) window.cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        setSnapPreview(null);
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (ev.clientX <= 30) {
          onUpdate({ x: 0, y: 72, width: vw / 2, height: vh - 72 - 80 });
        } else if (ev.clientX >= vw - 30) {
          onUpdate({ x: vw / 2, y: 72, width: vw / 2, height: vh - 72 - 80 });
        }
      }

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [win, onUpdate, onFocus],
  );

  // Mobile touch drag — double-tap titlebar to unlock, then drag
  const handleTitlebarTouch = useCallback(
    (e) => {
      const now = Date.now();
      const DOUBLE_TAP_MS = 300;

      if (now - lastTap.current < DOUBLE_TAP_MS) {
        // Double tap — toggle drag mode
        setTouchDragReady((prev) => !prev);
        lastTap.current = 0;
        return;
      }
      lastTap.current = now;

      if (!touchDragReady || win.maximized) return;

      onFocus();
      const t = e.touches[0];
      touchStart.current = {
        x: t.clientX,
        y: t.clientY,
        ox: win.x,
        oy: win.y,
      };
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
      onUpdate({
        x: touchStart.current.ox + dx,
        y: Math.max(72, touchStart.current.oy + dy),
      });
    },
    [touchDragReady, onUpdate],
  );

  const handleTouchEnd = useCallback(() => {
    touchStart.current = null;
  }, []);

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
        if (raf) window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(() => {
          onUpdate({
            width: Math.max(260, ow + (ev.clientX - startX)),
            height: Math.max(180, oh + (ev.clientY - startY)),
          });
        });
      }

      function onUp() {
        if (raf) window.cancelAnimationFrame(raf);
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
        top: 72,
        width: "100%",
        height: "calc(100vh - 72px - 80px)",
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
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={windowClass} style={style} onMouseDown={onFocus}>
      <div
        className="win-titlebar"
        onMouseDown={handleDragStart}
        onDoubleClick={onToggleMaximize}
        onTouchStart={handleTitlebarTouch}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={
          touchDragReady
            ? {
                background: "rgba(147, 112, 219, 0.18)",
                borderBottom: "0.5px solid rgba(147, 112, 219, 0.3)",
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
            top: 72,
            left: snapPreview === "left" ? 0 : "50%",
            width: "50%",
            height: "calc(100vh - 72px - 80px)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 12,
            pointerEvents: "none",
            zIndex: 99998,
            backdropFilter: "blur(2px)",
            transition: "opacity 0.15s ease",
            boxShadow: "inset 0 0 40px rgba(255,255,255,0.03)",
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
