/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        onyx: "#090909",          // primary background — near-black
        charcoal: "#141414",      // secondary background layer
        graphite: "#1A1A1A",      // panels / cards
        steel: "#2A2A2A",         // borders / dividers
        alloy: "#F5F5F5",         // primary light text / surfaces
        ash: "#A1A1A1",           // muted text
        burgundy: "#7A1E2C",         // primary accent — CTAs, active states
        "burgundy-light": "#9E2D40", // hover / brighter accent
        "burgundy-deep": "#5A0F1B",  // darker accent, gradients
        "burgundy-wine": "#3A0A12",  // near-black wine, deep gradient base
        crimson: "#E0607A",       // accent for TEXT on dark surfaces (>= 5:1); burgundy is for fills/borders
        rust: "#E0603F",          // destructive / error states only (>= 4.9:1 on panels)
      },
      fontFamily: {
        display: ["'Outfit'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "diagonal-cut": "linear-gradient(115deg, #090909 55%, #141414 55%)",
        "burgundy-glow": "radial-gradient(ellipse at center, rgba(122,30,44,0.35) 0%, rgba(9,9,9,0) 70%)",
        "grain": "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/><feColorMatrix type=%22saturate%22 values=%220%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.035%22/></svg>')",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
