import { useCallback } from "react";

export default function Window({
  win,
  children,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onUpdate,
}) {
  const handleDragStart = useCallback(
    (e) => {
      if (win.maximized) return;
      onFocus();
      const startX = e.clientX,
        startY = e.clientY;
      const ox = win.x,
        oy = win.y;

      function onMove(ev) {
        onUpdate({
          x: ox + (ev.clientX - startX),
          y: Math.max(72, oy + (ev.clientY - startY)),
        });
      }
      function onUp() {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      }
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [win, onUpdate, onFocus],
  );

  const handleResizeStart = useCallback(
    (e) => {
      e.stopPropagation();
      if (win.maximized) return;
      const startX = e.clientX,
        startY = e.clientY;
      const ow = win.width,
        oh = win.height;

      function onMove(ev) {
        onUpdate({
          width: Math.max(260, ow + (ev.clientX - startX)),
          height: Math.max(180, oh + (ev.clientY - startY)),
        });
      }
      function onUp() {
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

  return (
    <div
      className={`os-window${win.maximized ? " maximized" : ""}`}
      style={style}
      onMouseDown={onFocus}
    >
      <div
        className="win-titlebar"
        onMouseDown={handleDragStart}
        onDoubleClick={onToggleMaximize}
      >
        <div className="win-btns">
          <button className="win-btn btn-close" onClick={onClose} />
          <button className="win-btn btn-min" onClick={onMinimize} />
          <button className="win-btn btn-max" onClick={onToggleMaximize} />
        </div>
        <span className="win-title">{win.title}</span>
      </div>
      <div className="win-body">{children}</div>
      {!win.maximized && (
        <div className="win-resize" onMouseDown={handleResizeStart} />
      )}
    </div>
  );
}
