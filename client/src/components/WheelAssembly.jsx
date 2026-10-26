import { useRef } from "react";
import { motion } from "framer-motion";
import { WheelShape } from "./WheelGraphic";
import useOnScreen from "../hooks/useOnScreen";

/**
 * About-page centrepiece: an engineering-drawing style presentation of a
 * split-spoke forged wheel with its brake disc and caliper. Registration
 * crosshairs and a counter-rotating degree ring give it a "measured" feel.
 * Pure SVG + CSS transforms; pauses off-screen; static under reduced motion.
 */
export default function WheelAssembly({ reduceMotion }) {
  const ref = useRef(null);
  const onScreen = useOnScreen(ref);
  const ticks = Array.from({ length: 72 });

  return (
    <motion.div
      ref={ref}
      data-paused={!onScreen}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto aspect-square w-full max-w-sm sm:max-w-md"
    >
      <div className="hero-glow-core opacity-70" />
      <svg viewBox="-40 -40 480 480" className="relative h-full w-full" aria-hidden="true" focusable="false">
        {/* registration crosshair */}
        <path d="M-34 200H434M200 -34V434" stroke="#F5F5F5" strokeOpacity="0.14" strokeWidth="1" strokeDasharray="2 7" />

        {/* degree ring — turns the opposite way, very slowly */}
        <g
          className={reduceMotion ? "" : "wheel-spin-reverse"}
          style={{ transformBox: "fill-box", transformOrigin: "center", "--wheel-duration": "160s" }}
        >
          {ticks.map((_, i) => {
            const major = i % 6 === 0;
            const a = (i * 5 * Math.PI) / 180;
            const r1 = 211;
            const r2 = major ? 228 : 219;
            return (
              <line
                key={i}
                x1={200 + r1 * Math.cos(a)}
                y1={200 + r1 * Math.sin(a)}
                x2={200 + r2 * Math.cos(a)}
                y2={200 + r2 * Math.sin(a)}
                stroke={major ? "#C23A52" : "#F5F5F5"}
                strokeOpacity={major ? 0.9 : 0.35}
                strokeWidth={major ? 1.6 : 1}
              />
            );
          })}
          <circle cx="200" cy="200" r="228" fill="none" />
        </g>

        <WheelShape variant="split" spin={!reduceMotion} duration={70} />

        {/* corner brackets */}
        {[
          "M-34 -10V-34H-10",
          "M410 -34H434V-10",
          "M-34 410V434H-10",
          "M434 410V434H410",
        ].map((d) => (
          <path key={d} d={d} fill="none" stroke="#7A1E2C" strokeWidth="2" />
        ))}
      </svg>
    </motion.div>
  );
}
