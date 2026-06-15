import { useEffect, useRef } from "react";

const LEAF_COUNT = 22;
const LEAF_EMOJIS = ["🍃", "🍂", "🍁"];

export default function Leaves() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < LEAF_COUNT; i++) {
      const leaf = document.createElement("div");
      leaf.className = "leaf";

      leaf.textContent =
        LEAF_EMOJIS[Math.floor(Math.random() * LEAF_EMOJIS.length)];

      // Spawn along the top and left edges only
      const spawnOnTop = Math.random() > 0.5;
      if (spawnOnTop) {
        leaf.style.left = `${Math.random() * 100}vw`;
        leaf.style.top = `-${10 + Math.random() * 40}px`;
      } else {
        leaf.style.left = `-${10 + Math.random() * 40}px`;
        leaf.style.top = `${Math.random() * 60}vh`;
      }

      const size = 14 + Math.random() * 18;
      leaf.style.fontSize = `${size}px`;

      const travelDuration = 8 + Math.random() * 10;
      const swayDuration = 2 + Math.random() * 3;
      const fadeDuration = 4 + Math.random() * 5;
      const delay = Math.random() * 12;
      const fadeDelay = delay + 0.5 + Math.random() * 2;

      leaf.style.animationName = "leafTravel, leafSway, leafFade";
      leaf.style.animationDuration = `${travelDuration}s, ${swayDuration}s, ${fadeDuration}s`;
      leaf.style.animationDelay = `${delay}s, ${delay}s, ${fadeDelay}s`;
      leaf.style.animationTimingFunction = "linear, ease-in-out, ease-in-out";
      leaf.style.animationIterationCount = "infinite, infinite, infinite";
      leaf.style.opacity = 0;

      container.appendChild(leaf);
    }

    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  return <div id="leaf-container" ref={containerRef} />;
}
