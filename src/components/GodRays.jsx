import { useEffect, useRef } from "react";

const isMobile = window.innerWidth < 768;

const CONFIG = isMobile
  ? { rayCount: 14, angleMin: 0.05, angleSpread: 1.5, ox: -80, oy: -200 }
  : { rayCount: 18, angleMin: 0.05, angleSpread: 0.75, ox: -150, oy: -150 };

export default function GodRays() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrameId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function makeRay(forceAngle) {
      const angle =
        forceAngle ?? CONFIG.angleMin + Math.random() * CONFIG.angleSpread;
      return {
        angle,
        width: 30 + Math.random() * 90,
        widthTarget: 30 + Math.random() * 90,
        widthSpeed: 0.002 + Math.random() * 0.003,
        phase: "fadein",
        opacity: 0,
        opacityPeak: 0.04 + Math.random() * 0.09,
        fadeInSpeed: 0.0008 + Math.random() * 0.001,
        fadeOutSpeed: 0.0005 + Math.random() * 0.0008,
        holdTimer: 0,
        holdDuration: 3000 + Math.random() * 6000,
        angleDrift: (Math.random() - 0.5) * 0.00006,
        spawnDelay: Math.random() * 5000,
        spawned: false,
      };
    }

    const rays = Array.from({ length: CONFIG.rayCount }, (_, i) => {
      const angle =
        CONFIG.angleMin +
        (i / CONFIG.rayCount) * CONFIG.angleSpread +
        (Math.random() - 0.5) * 0.04;
      return makeRay(angle);
    });

    let lastTime = performance.now();

    function draw(t) {
      const dt = Math.min(t - lastTime, 50);
      lastTime = t;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ox = CONFIG.ox;
      const oy = CONFIG.oy;
      const length = Math.hypot(canvas.width, canvas.height) * 1.8;

      for (let i = 0; i < rays.length; i++) {
        const ray = rays[i];

        if (!ray.spawned) {
          ray.spawnDelay -= dt;
          if (ray.spawnDelay > 0) continue;
          ray.spawned = true;
        }

        if (ray.phase === "fadein") {
          ray.opacity += ray.fadeInSpeed * dt;
          if (ray.opacity >= ray.opacityPeak) {
            ray.opacity = ray.opacityPeak;
            ray.phase = "hold";
            ray.holdTimer = 0;
          }
        } else if (ray.phase === "hold") {
          ray.holdTimer += dt;
          ray.opacity =
            ray.opacityPeak + Math.sin(t * 0.0006 + i * 1.7) * 0.018;
          ray.opacity = Math.max(0, ray.opacity);
          if (ray.holdTimer >= ray.holdDuration) {
            ray.phase = "fadeout";
          }
        } else if (ray.phase === "fadeout") {
          ray.opacity -= ray.fadeOutSpeed * dt;
          if (ray.opacity <= 0) {
            ray.opacity = 0;
            rays[i] = makeRay();
            rays[i].spawnDelay = 800 + Math.random() * 4000;
            continue;
          }
        }

        ray.width += (ray.widthTarget - ray.width) * ray.widthSpeed;
        if (Math.abs(ray.width - ray.widthTarget) < 1) {
          ray.widthTarget = 30 + Math.random() * 90;
        }

        ray.angle += ray.angleDrift;

        const halfAngle = Math.atan2(ray.width / 2, length);
        const a1 = ray.angle - halfAngle;
        const a2 = ray.angle + halfAngle;

        const x1 = ox + Math.cos(a1) * length;
        const y1 = oy + Math.sin(a1) * length;
        const x2 = ox + Math.cos(a2) * length;
        const y2 = oy + Math.sin(a2) * length;

        const grad = ctx.createLinearGradient(
          ox,
          oy,
          ox + Math.cos(ray.angle) * length,
          oy + Math.sin(ray.angle) * length,
        );

        const o = ray.opacity;
        grad.addColorStop(0, `rgba(255, 252, 225, ${o * 2.2})`);
        grad.addColorStop(0.08, `rgba(255, 251, 218, ${o * 1.6})`);
        grad.addColorStop(0.3, `rgba(255, 249, 210, ${o * 1.0})`);
        grad.addColorStop(0.65, `rgba(255, 247, 200, ${o * 0.4})`);
        grad.addColorStop(1, `rgba(255, 245, 190, 0)`);

        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();

        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = "screen";
        ctx.fill();
      }

      animFrameId = requestAnimationFrame(draw);
    }

    animFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",

        pointerEvents: "none",
        zIndex: 1,
        maskImage: `radial-gradient(ellipse 70% 80% at 20% 15%, black 0%, black 20%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.15) 60%, transparent 100%)`,

        WebkitMaskImage: `radial-gradient(ellipse 70% 80% at 20% 15%, black 0%, black 20%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.15) 60%, transparent 100%)`,
      }}
    />
  );
}
