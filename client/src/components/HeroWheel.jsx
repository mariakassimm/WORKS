import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import WheelGraphic from "./WheelGraphic";
import useOnScreen from "../hooks/useOnScreen";

/**
 * Hero centrepiece: a turbine alloy wheel with fixed caliper, a slow rotation,
 * a periodic light sweep and a gentle pointer-driven tilt.
 *
 * - The wheel is inline SVG, so there is no asset that can fail to load, and
 *   the aspect-square wrapper reserves its space (no layout shift).
 * - All looping motion is CSS transform/opacity (compositor only) and pauses
 *   when the hero is scrolled out of view (data-paused).
 * - Under prefers-reduced-motion the wheel renders static, with no sweep/tilt.
 */
export default function HeroWheel({ springX, springY, reduceMotion }) {
  const ref = useRef(null);
  const onScreen = useOnScreen(ref);
  const rotateX = useTransform(springY, [-1, 1], [7, -7]);
  const rotateY = useTransform(springX, [-1, 1], [-9, 9]);

  return (
    <div
      ref={ref}
      data-paused={!onScreen}
      className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-sm lg:max-w-[28rem]"
      style={{ perspective: 1000 }}
    >
      <div className="hero-glow-core" />
      <span aria-hidden="true" className={`absolute -inset-[6%] rounded-full border border-dashed border-steel/80 ${reduceMotion ? "" : "wheel-spin-reverse"}`} style={{ "--wheel-duration": "140s" }} />

      <motion.div
        style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.9, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <WheelGraphic
          className="h-full w-full drop-shadow-[0_28px_50px_rgba(0,0,0,0.85)]"
          variant="turbine"
          spin={!reduceMotion}
          duration={46}
        />
        {!reduceMotion && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-[1%] overflow-hidden rounded-full">
            <span className="wheel-sweep" />
          </span>
        )}
      </motion.div>
    </div>
  );
}
