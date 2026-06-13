import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="landing-page min-h-screen relative overflow-hidden">
      {/* Dynamic Grid Background */}
      <div className="hud-grid" />

      {/* Mouse Glow Follower */}
      <div 
        className="ambient-glow" 
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} 
      />

      {/* Absolute minimal navigation elements floating in corners */}
      <motion.div
        className="fixed top-8 left-8 z-50 mix-blend-difference"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <div
          className="text-3xl text-white tracking-widest"
          style={{
            fontFamily: "'Playfair Display', Didot, 'Bodoni MT', 'Times New Roman', serif",
            fontStyle: 'italic',
            fontWeight: 300
          }}
        >
          Galero
        </div>
      </motion.div>

      {/* Center bottom project name */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 mix-blend-difference"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
      >
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1 text-center">Project</div>
        <div className="text-xs uppercase tracking-widest text-white text-center">Galero</div>
      </motion.div>

      <motion.div
        className="fixed bottom-8 left-8 z-50 mix-blend-difference"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
      >
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1">Coordinates</div>
        <div className="text-xs tracking-widest text-white">40°42'46"N 74°00'21"W</div>
      </motion.div>

      <motion.div
        className="fixed bottom-8 right-8 z-50 mix-blend-difference text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
      >
        <Link to="/explore" className="group flex items-center gap-4 cursor-pointer">
          <div className="text-xs uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors duration-700">Paintings</div>
          <div className="w-8 h-[1px] bg-white/30 group-hover:w-16 group-hover:bg-white transition-all duration-700"></div>
        </Link>
      </motion.div>

      {/* Main Cinematic Title */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative flex items-center justify-center pointer-events-auto">
          {/* Subtle Corner Brackets for HUD feel */}
          <div className="hud-frame flex items-center justify-center">
            <div className="corner-bl" />
            <div className="corner-br" />
          </div>

          <motion.div
            className="text-center mix-blend-difference pointer-events-none select-none z-10"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 3, delay: 0.5, ease: 'easeOut' }}
          >
            <h1 className="text-[8vw] leading-none font-display text-white tracking-tighter mix-blend-overlay opacity-90">
              FROZEN
              <br />
              PROVENANCE
            </h1>
            <motion.p
              className="mt-8 text-sm uppercase tracking-[0.5em] text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 2.5 }}
            >
              Digital Artifacts // Immutable Records
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Subtle interaction zone to prompt scroll or movement */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-0"></div>
    </div>
  );
}

