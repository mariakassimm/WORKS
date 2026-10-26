import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from "framer-motion";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import HeroBackground from "../components/HeroBackground";
import HeroWheel from "../components/HeroWheel";
import InquiryModal from "../components/InquiryModal";
import { fetchProducts, fetchCategories, fetchApprovedReviews } from "../services/api";


const HEADLINE_LINE_1 = ["PARTS", "THAT", "KEEP"];
const HEADLINE_LINE_2 = ["THE", "MACHINE", "MOVING."];

const wordReveal = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

const lineStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
};

function HeroHeadline({ reduceMotion }) {
  if (reduceMotion) {
    return (
      <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-alloy sm:text-6xl lg:text-7xl">
        PARTS THAT KEEP
        <br />
        <span className="text-crimson">THE MACHINE MOVING.</span>
      </h1>
    );
  }

  return (
    <motion.h1
      variants={lineStagger}
      initial="hidden"
      animate="show"
      className="mt-4 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-alloy sm:text-6xl lg:text-7xl"
    >
      <span className="block overflow-hidden pb-1">
        {HEADLINE_LINE_1.map((word, i) => (
          <motion.span key={i} variants={wordReveal} className="mr-[0.22em] inline-block">
            {word}
          </motion.span>
        ))}
      </span>
      <span className="block overflow-hidden pb-1 text-crimson">
        {HEADLINE_LINE_2.map((word, i) => (
          <motion.span key={i} variants={wordReveal} className="mr-[0.22em] inline-block">
            {word}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  );
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);

  const heroRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 55, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 55, damping: 20, mass: 0.6 });

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const scrollFade = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
  const scrollShift = useTransform(scrollYProgress, [0, 1], [0, 70]);

  useEffect(() => {
    fetchProducts({ featured: "true" }).then((d) => setFeatured(d.products.slice(0, 6))).catch(() => {});
    fetchCategories().then((d) => setCategories(d.categories)).catch(() => {});
    fetchApprovedReviews().then((d) => setReviews(d.reviews)).catch(() => {});
  }, []);

  const handlePointerMove = (e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    const x = ((point.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((point.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const resetPointer = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <>
      <SEO />

      {/* HERO */}
      <section
        ref={heroRef}
        onMouseMove={handlePointerMove}
        onMouseLeave={resetPointer}
        onTouchMove={handlePointerMove}
        onTouchEnd={resetPointer}
        className="relative overflow-hidden border-b border-steel bg-onyx"
      >
        <HeroBackground springX={springX} springY={springY} reduceMotion={reduceMotion} />

        <motion.div
          style={reduceMotion ? undefined : { opacity: scrollFade, y: scrollShift }}
          className="section relative grid items-center gap-12 py-16 sm:py-20 md:grid-cols-2 md:py-32"
        >
          <div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-display text-xs font-medium tracking-[0.3em] text-crimson">
                WORKS — PREMIUM USED PARTS
              </p>
              <motion.span
                initial={reduceMotion ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="mt-2 block h-px w-16 origin-left bg-burgundy"
              />
            </motion.div>

            <HeroHeadline reduceMotion={reduceMotion} />

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="mt-6 max-w-md text-base leading-relaxed text-ash"
            >
              WORKS supplies inspected used engine, body and wheel parts for old and new vehicles — sourced, checked, and ready to fit.
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/catalogue" className="btn-primary">Explore Parts</Link>
              <Link to="/contact" className="btn-secondary">Contact Us</Link>
            </motion.div>
          </div>

          <div className="relative flex items-center justify-center">
            <HeroWheel springX={springX} springY={springY} reduceMotion={reduceMotion} />
          </div>
        </motion.div>

        {/* scroll cue */}
        {!reduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
          >
            <span className="font-display text-[10px] tracking-[0.3em] text-ash">SCROLL</span>
            <span className="relative h-8 w-px overflow-hidden bg-steel">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-burgundy-light"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>
        )}
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="section py-16">
          <h2 className="font-display text-2xl font-medium text-alloy">Browse by category</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/catalogue?category=${encodeURIComponent(c.name)}`}
                className="rounded-sm border border-steel px-4 py-2 font-display text-sm text-ash transition-all duration-300 ease-premium hover:border-burgundy hover:text-crimson"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="section py-16">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-medium text-alloy">Featured this week</h2>
              <p className="mt-1 text-sm text-ash">A rotating selection from current stock.</p>
            </div>
            <Link to="/catalogue" className="hidden font-display text-sm text-crimson hover:underline sm:block">
              View all parts →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* WHY */}
      <section className="border-y border-steel bg-charcoal py-16">
        <div className="section">
          <h2 className="font-display text-2xl font-medium text-alloy">Why WORKS</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div className="border-l-2 border-burgundy pl-5">
              <h3 className="font-display text-lg font-medium text-alloy">Checked before listing</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">Every part is inspected for condition before it goes on the shelf — no surprises on pickup.</p>
            </div>
            <div className="border-l-2 border-burgundy pl-5">
              <h3 className="font-display text-lg font-medium text-alloy">Built for dealers &amp; mechanics</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">Straightforward pricing and clear compatibility so you can move fast on the job.</p>
            </div>
            <div className="border-l-2 border-burgundy pl-5">
              <h3 className="font-display text-lg font-medium text-alloy">Old and new vehicles</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">A working range across common makes and models, not just the newest cars.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS — only renders once real, approved reviews exist */}
      {reviews.length > 0 && (
        <section className="section py-16">
          <h2 className="font-display text-2xl font-medium text-alloy">What customers say</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <div key={r._id} className="panel panel-hover p-6">
                <div className="flex gap-1 text-crimson" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < r.rating ? "★" : "☆"}</span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-ash">{r.message}</p>
                <p className="mt-4 font-display text-sm text-alloy">— {r.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT CTA */}
      <section className="border-t border-steel bg-charcoal py-20">
        <div className="section flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-medium text-alloy">Found a part you need?</h2>
            <p className="mt-2 max-w-md text-sm text-ash">Send us the part name and your vehicle details — we'll get back to you directly.</p>
          </div>
          <button type="button" onClick={() => setInquiryOpen(true)} className="btn-primary">
            Contact Us
          </button>
        </div>
      </section>
      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}
