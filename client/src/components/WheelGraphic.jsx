import { useId } from "react";

/**
 * Parametric alloy-wheel artwork (pure SVG, no external assets, no lettering).
 *
 * Layers, back to front: tyre -> brake disc (turns with the wheel) ->
 * brake caliper (fixed, like the real thing) -> spokes + hub (turn) ->
 * polished rim lip -> static specular sheen.
 *
 * Rotation is a single CSS keyframe on two <g> groups (see .wheel-spin in
 * index.css): compositor-only, no JavaScript animation loop. Pass `spin={false}`
 * for a static render (reduced motion, off-screen, or print).
 */

const polar = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [200 + r * Math.cos(a), 200 + r * Math.sin(a)];
};

// Annular sector (used for the brake caliper).
const sector = (r1, r2, a1, a2) => {
  const [x1, y1] = polar(r2, a1);
  const [x2, y2] = polar(r2, a2);
  const [x3, y3] = polar(r1, a2);
  const [x4, y4] = polar(r1, a1);
  return `M${x1} ${y1} A${r2} ${r2} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r1} ${r1} 0 0 0 ${x4} ${y4} Z`;
};

// Spoke outlines are drawn along +x from the hub and rotated into place.
const SPOKES = {
  turbine: {
    count: 10,
    body: "M48 -12 C92 -14 126 -38 158 -46 L164 -8 C130 -6 94 14 50 20 Z",
    inset: "M58 -6 C94 -8 126 -28 150 -36 L154 -14 C126 -8 96 8 60 13 Z",
    edge: "M48 -12 C92 -14 126 -38 158 -46",
  },
  split: {
    count: 5,
    body: "M44 -14 L100 -16 L160 -48 L170 -32 L112 6 L170 38 L160 52 L100 18 L44 14 Z",
    inset: "M54 -8 L102 -10 L156 -38 L160 -32 L108 6 L160 40 L156 46 L102 12 L54 8 Z",
    edge: "M44 -14 L100 -16 L160 -48 L170 -32",
  },
};

export function WheelShape({ variant = "turbine", spin = true, duration = 42, caliper = true, idBase }) {
  const raw = useId();
  const id = (idBase || raw).replace(/[^a-zA-Z0-9_-]/g, "");
  const u = (name) => `${id}-${name}`;
  const spec = SPOKES[variant] || SPOKES.turbine;

  const rotStyle = {
    transformBox: "fill-box",
    transformOrigin: "center",
    "--wheel-duration": `${duration}s`,
  };
  const cls = spin ? "wheel-spin" : "";

  return (
    <g>
      <defs>
        <linearGradient id={u("metal")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F4F4" />
          <stop offset="0.42" stopColor="#A9A9A9" />
          <stop offset="0.75" stopColor="#4A4A4A" />
          <stop offset="1" stopColor="#8E8E8E" />
        </linearGradient>
        <linearGradient id={u("lip")} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#9C9C9C" />
          <stop offset="0.65" stopColor="#3A3A3A" />
          <stop offset="1" stopColor="#CFCFCF" />
        </linearGradient>
        <radialGradient id={u("disc")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.2" stopColor="#0A0A0A" />
          <stop offset="0.8" stopColor="#242424" />
          <stop offset="1" stopColor="#3A3A3A" />
        </radialGradient>
        <linearGradient id={u("calp")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C23A52" />
          <stop offset="0.55" stopColor="#7A1E2C" />
          <stop offset="1" stopColor="#4A0E18" />
        </linearGradient>
        <radialGradient id={u("hub")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#E9E9E9" />
          <stop offset="0.5" stopColor="#6F6F6F" />
          <stop offset="1" stopColor="#1C1C1C" />
        </radialGradient>
        <linearGradient id={u("sheen")} x1="0.12" y1="0.05" x2="0.88" y2="0.95">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.38" />
        </linearGradient>
      </defs>

      {/* tyre */}
      <circle cx="200" cy="200" r="198" fill="#0A0A0A" stroke="#262626" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="194" fill="none" stroke="#161616" strokeWidth="6" strokeDasharray="3 5" />
      <circle cx="200" cy="200" r="188" fill="none" stroke="#202020" strokeWidth="1" />

      {/* barrel + brake disc (turns with the wheel) */}
      <circle cx="200" cy="200" r="162" fill="#070707" />
      <g className={cls} style={rotStyle}>
        <circle cx="200" cy="200" r="150" fill={`url(#${u("disc")})`} stroke="#3E3E3E" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="#303030" strokeWidth="1" />
        {Array.from({ length: 24 }).map((_, i) => {
          const [x, y] = polar(135, i * 15);
          return <circle key={i} cx={x} cy={y} r="2.4" fill="#050505" stroke="#444" strokeWidth="0.6" />;
        })}
        <circle cx="200" cy="200" r="150" fill="none" /> {/* keeps the group's box centred on the hub */}
      </g>

      {/* caliper — stays put while the disc turns beneath it */}
      {caliper && (
        <g>
          <path d={sector(112, 150, -66, -14)} fill={`url(#${u("calp")})`} stroke="#E05A72" strokeOpacity="0.55" strokeWidth="1" />
          <path d={sector(124, 138, -58, -22)} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="1" />
          {[-56, -24].map((a) => {
            const [x, y] = polar(131, a);
            return <circle key={a} cx={x} cy={y} r="4" fill="#1A1A1A" stroke="#C9C9C9" strokeOpacity="0.7" strokeWidth="1" />;
          })}
        </g>
      )}

      {/* spokes + hub (turn) */}
      <g className={cls} style={rotStyle}>
        {Array.from({ length: spec.count }).map((_, i) => (
          <g key={i} transform={`translate(200 200) rotate(${(i * 360) / spec.count})`}>
            <path d={spec.body} fill={`url(#${u("metal")})`} stroke="#0A0A0A" strokeWidth="1.2" strokeLinejoin="round" />
            <path d={spec.inset} fill="#0A0A0A" opacity="0.42" />
            <path d={spec.edge} fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        ))}
        <circle cx="200" cy="200" r="52" fill={`url(#${u("hub")})`} stroke="#0A0A0A" strokeWidth="2" />
        <circle cx="200" cy="200" r="45" fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="1.5" />
        {Array.from({ length: 5 }).map((_, i) => {
          const [x, y] = polar(32, i * 72 - 90);
          return <circle key={i} cx={x} cy={y} r="5.5" fill={`url(#${u("metal")})`} stroke="#0A0A0A" strokeWidth="1" />;
        })}
        <circle cx="200" cy="200" r="17" fill="#0B0B0B" stroke="#C23A52" strokeWidth="2.2" />
        <circle cx="200" cy="200" r="9" fill="none" stroke={`url(#${u("metal")})`} strokeWidth="1.6" />
        <circle cx="200" cy="200" r="160" fill="none" /> {/* centres the group's box */}
      </g>

      {/* polished rim lip + static light */}
      <circle cx="200" cy="200" r="168" fill="none" stroke={`url(#${u("lip")})`} strokeWidth="13" />
      <circle cx="200" cy="200" r="160.5" fill="none" stroke="#000" strokeOpacity="0.7" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="198" fill={`url(#${u("sheen")})`} pointerEvents="none" />
    </g>
  );
}

export default function WheelGraphic({ className = "", ...props }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" focusable="false">
      <WheelShape {...props} />
    </svg>
  );
}
