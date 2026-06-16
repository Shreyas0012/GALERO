import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import InteractiveWebGL from '../components/layout/InteractiveWebGL';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing-page relative">
      {/* Fixed Interactive WebGL Galaxy background */}
      <InteractiveWebGL />

      {/* Dynamic Grid Background overlay */}
      <div className="hud-grid" style={{ position: 'fixed', zIndex: 1 }} />



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
      <section className="landing-section !justify-start pt-36">
        <div className="relative flex items-center justify-center pointer-events-auto">
          {/* Corner brackets */}
          <div className="hud-frame flex items-center justify-center">
            <div className="corner-bl" />
            <div className="corner-br" />
          </div>

          <motion.div
            className="text-center mix-blend-difference pointer-events-none select-none z-10"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 3, delay: 0.3, ease: 'easeOut' }}
          >
            <h1 className="text-[11vw] sm:text-6xl md:text-[8vw] leading-none font-display text-white tracking-tighter mix-blend-overlay opacity-90 landing-title">
              FROZEN
              <br />
              PROVENANCE
            </h1>
            <motion.p
              className="mt-8 text-sm uppercase tracking-[0.5em] text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
            >
              Scroll down to explore the immersive digital art archive.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* --- Section 2: Immersive Info --- */}
      <section className="landing-section">
        <motion.div
          className="text-center mix-blend-difference max-w-2xl px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6 tracking-wide">
            Digital Art Archive
          </h2>
          <p className="text-lg text-white/60 tracking-wider leading-relaxed">
            Traverse floating 3D canvas installations locked dynamically inside the immutable digital matrix.
          </p>
        </motion.div>
      </section>

      {/* --- Section 3: Call to Action (Enter) --- */}
      <section className="landing-section">
        <motion.div
          className="text-center mix-blend-difference max-w-2xl px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
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
              <div className="w-8 h-[1px] bg-white/30 group-hover:w-16 group-hover:bg-white transition-all duration-700"></div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
