import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import InteractiveWebGL from '../components/layout/InteractiveWebGL';
import DensityMap from '../components/layout/DensityMap';
import './Landing.css';

export default function Landing() {
  const mapOverlayRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!mapOverlayRef.current) return;
      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // Map fades IN after section 1 scrolls away and camera is in dark downstream
      // Fade in:  1.1vh → 1.6vh  (just after section 1 title clears)
      // Full:     1.6vh → 2.4vh  (fully visible over the dark canyon)
      // Fade out: 2.4vh → 2.8vh  (before CTA section)
      const fadeInStart  = vh * 1.1;
      const fadeInEnd    = vh * 1.6;
      const fadeOutStart = vh * 2.4;
      const fadeOutEnd   = vh * 2.8;

      let opacity = 0;
      if (scrollY >= fadeInStart && scrollY < fadeInEnd) {
        opacity = (scrollY - fadeInStart) / (fadeInEnd - fadeInStart);
      } else if (scrollY >= fadeInEnd && scrollY < fadeOutStart) {
        opacity = 1;
      } else if (scrollY >= fadeOutStart && scrollY <= fadeOutEnd) {
        opacity = 1 - (scrollY - fadeOutStart) / (fadeOutEnd - fadeOutStart);
      }

      mapOverlayRef.current.style.opacity = opacity;
      mapOverlayRef.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page relative">
      {/* Fixed Interactive WebGL Galaxy background */}
      <InteractiveWebGL />

      {/* Dynamic Grid Background overlay */}
      <div className="hud-grid" style={{ position: 'fixed', zIndex: 1 }} />

      {/* ── Fixed map HUD overlay ── appears over dark downstream WebGL */}
      <div
        ref={mapOverlayRef}
        className="density-map-overlay"
        style={{ opacity: 0, pointerEvents: 'none' }}
      >
        {/* Header */}
        <div className="density-map-header">
          <div className="text-[10px] uppercase tracking-[0.5em] text-white/35 mb-2">
            Global Reach
          </div>
          <h2 className="text-2xl md:text-3xl font-display text-white tracking-wide">
            Collector Distribution
          </h2>
          <p className="text-sm text-white/40 tracking-wider mt-2">
            Hover over a region to explore density
          </p>
        </div>

        {/* Map fills the overlay */}
        <DensityMap />
      </div>

      {/* Coordinates HUD */}
      <motion.div
        className="hidden md:block fixed bottom-8 left-8 z-50 mix-blend-difference"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
      >
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1">Coordinates</div>
        <div className="text-xs tracking-widest text-white">40°42'46"N 74°00'21"W</div>
      </motion.div>

      {/* --- Section 1: Main Title Intro --- */}
      <section className="landing-section" style={{ justifyContent: 'flex-end', alignItems: 'flex-start' }}>

        {/* HUD corner bracket — top-right */}
        <div className="hud-frame" style={{ position: 'absolute', top: '2rem', right: '2rem', left: 'auto', width: 80, height: 80 }}>
          <div className="corner-bl" />
          <div className="corner-br" />
        </div>

        <motion.div
          className="pointer-events-none select-none z-10"
          style={{ paddingBottom: '5rem', paddingLeft: '2.5rem' }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.4, ease: 'easeOut' }}
        >
          <motion.div
            className="text-[10px] uppercase tracking-[0.55em] text-white/40 mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          >
            Digital Art Archive &nbsp;/&nbsp; Provenance
          </motion.div>

          <motion.div
            style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.18)', marginBottom: '1.5rem' }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.0 }}
          />

          <h1 className="landing-title font-display text-white leading-none tracking-tighter"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 4.5rem)' }}>
            DIGITAL<br />
            <span style={{ marginLeft: '0.12em', opacity: 0.88 }}>PROVENANCE</span>
          </h1>

          <motion.p
            className="mt-7 text-[11px] uppercase tracking-[0.45em] text-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.3 }}
          >
            Scroll to explore the collection
          </motion.p>
        </motion.div>
      </section>

      {/* --- Section 2: Scroll space for map overlay (transparent) --- */}
      <section className="landing-section" style={{ pointerEvents: 'none' }} />

      {/* --- Section 3: Call to Action --- */}
      <section className="landing-section">
        <motion.div
          className="text-center mix-blend-difference max-w-2xl px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 1.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6 tracking-wide">
            Immutable Provenance Ledger
          </h2>
          <p className="text-lg text-white/60 tracking-wider mb-12">
            Verify the creator, ownership history, and authenticity records of every physical and digital masterpiece.
          </p>

          <div className="flex justify-center">
            <Link to="/explore" className="group flex items-center gap-4 cursor-pointer">
              <div className="text-sm uppercase tracking-[0.3em] text-white/70 group-hover:text-white transition-colors duration-700 font-semibold">
                Explore Paintings
              </div>
              <div className="w-8 h-[1px] bg-white/30 group-hover:w-16 group-hover:bg-white transition-all duration-700" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
