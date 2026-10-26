import { useEffect, useRef } from "react";
import { motion, useTransform } from "framer-motion";
import useOnScreen from "../hooks/useOnScreen";

/**
 * Layered hero backdrop: three depth-separated gradient blobs drifting on
 * independent CSS-keyframe cycles (cheap, compositor-only), plus a canvas
 * ember system for foreground energy. Mouse/touch parallax is applied via
 * spring motion values passed in from the parent so all layers stay in sync.
 * Fully inert under prefers-reduced-motion.
 */
export default function HeroBackground({ springX, springY, reduceMotion }) {
  const canvasRef = useRef(null);
  const rootRef = useRef(null);
  const onScreen = useOnScreen(rootRef, "0px");
  // Deepest layer moves the least — a few pixels of drift reads as depth,
  // not a distraction.
  const bgX = useTransform(springX, [-1, 1], [-16, 16]);
  const bgY = useTransform(springY, [-1, 1], [-12, 12]);

  useEffect(() => {
    // Nothing runs while reduced motion is requested or the hero is off-screen.
    if (reduceMotion || !onScreen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let particles = [];
    let width = 0;
    let height = 0;
    let visible = document.visibilityState === "visible";

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 18 : 34;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const spawn = () => ({
      x: Math.random() * width,
      y: height + Math.random() * 60,
      r: Math.random() * 1.8 + 0.6,
      vy: Math.random() * 0.35 + 0.15,
      drift: (Math.random() - 0.5) * 0.25,
      life: 0,
      maxLife: Math.random() * 400 + 300,
      hue: Math.random() > 0.5 ? "158,42,58" : "245,245,245", // burgundy-light or alloy embers
      flicker: Math.random() * Math.PI * 2,
    });

    resize();
    particles = Array.from({ length: COUNT }, () => ({ ...spawn(), y: Math.random() * height }));

    const onResize = () => resize();
    const onVisibility = () => { visible = document.visibilityState === "visible"; };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.life += 1;
        p.x += p.drift;
        p.y -= p.vy;
        p.flicker += 0.04;
        const lifeRatio = p.life / p.maxLife;
        const fade = lifeRatio < 0.15 ? lifeRatio / 0.15 : lifeRatio > 0.8 ? (1 - lifeRatio) / 0.2 : 1;
        const twinkle = 0.55 + Math.sin(p.flicker) * 0.25;
        const alpha = Math.max(0, fade * twinkle * 0.55);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${alpha})`;
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -20) {
          Object.assign(p, spawn());
        }
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion, onScreen]);

  return (
    <div ref={rootRef} data-paused={!onScreen} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* deepest layer — large slow blobs, barely reacts to parallax */}
      <motion.div
        className="absolute inset-0"
        style={reduceMotion ? undefined : { x: bgX, y: bgY }}
      >
        <div className="hero-blob hero-blob-a" />
        <div className="hero-blob hero-blob-b" />
        <div className="hero-blob hero-blob-c" />
      </motion.div>

      {/* grain + vignette for depth */}
      <div className="absolute inset-0 bg-grain" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#090909_92%)]" />

      {/* ember particles — foreground energy layer */}
      {!reduceMotion && onScreen && <canvas ref={canvasRef} className="absolute inset-0" />}
    </div>
  );
}
