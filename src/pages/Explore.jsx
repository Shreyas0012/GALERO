import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryExhibit from '../components/domain/GalleryExhibit';
import AtmosphericBackground from '../components/layout/AtmosphericBackground';
import { artworksApi, normalizeArtwork } from '../data/api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import './Explore.css';

const MODES = [
  { id: 'portrait', label: 'Portrait', glyph: '▯' },
  { id: 'landscape', label: 'Landscape', glyph: '▭' },
];

const galleryVariants = {
  hidden: { opacity: 0, filter: 'blur(16px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.18 },
  },
  exit: {
    opacity: 0,
    filter: 'blur(12px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Explore() {
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState('portrait');
  const [searchTerm, setSearchTerm] = useState('');

  // ── Real API data ──
  const { data: rawArtworks, loading, error } = useFetch(artworksApi.getAll);

  const artworks = useMemo(() =>
    (rawArtworks || []).map(normalizeArtwork),
    [rawArtworks]
  );

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = artwork.orientation === activeMode;
    return matchesSearch && matchesMode;
  });

  // Auto-switch mode if current mode is empty but the other mode has items
  useEffect(() => {
    const hasPortrait = artworks.some(art => art.orientation === 'portrait');
    const hasLandscape = artworks.some(art => art.orientation === 'landscape');
    
    if (activeMode === 'portrait' && !hasPortrait && hasLandscape) {
      setActiveMode('landscape');
    } else if (activeMode === 'landscape' && !hasLandscape && hasPortrait) {
      setActiveMode('portrait');
    }
  }, [activeMode, artworks]);

  const isPortrait = activeMode === 'portrait';

  if (loading) return (
    <>
      <AtmosphericBackground />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em', fontSize: '11px', textTransform: 'uppercase' }}>
        Loading Archive...
      </div>
    </>
  );

  if (error) return (
    <>
      <AtmosphericBackground />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'rgba(255,100,100,0.5)', letterSpacing: '0.3em', fontSize: '11px', textTransform: 'uppercase' }}>
        Failed to load — is the backend running?
      </div>
    </>
  );

  return (
    <>
      <AtmosphericBackground />

      <div className="explore-page container">

        {/* Cinematic Welcome Header */}
        <header className="explore-header relative z-10 flex flex-col items-center justify-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="text-[10px] tracking-[0.5em] uppercase text-white/25 font-light mb-0"
          >
            {user ? 'Welcome back' : 'Welcome to the'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="text-4xl md:text-5xl font-display font-light tracking-tighter mb-10 relative -top-3"
          >
            {user ? user.name.split(' ')[0] : 'ARCHIVE'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="text-white/30 tracking-[0.2em] uppercase text-xs font-light max-w-xl -mt-2"
          >
            A curated archive of transcendent digital artifacts
          </motion.p>
        </header>

        {/* Floating Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 2 }}
          className="relative md:fixed md:top-24 md:left-1/2 md:-translate-x-1/2 z-40 w-full max-w-xs mx-auto opacity-70 md:opacity-30 hover:opacity-100 transition-opacity duration-700 mt-6 md:mt-0"
        >
          <div className="flex items-center border-b border-white/20 pb-2">
            <input
              type="text"
              placeholder="Search archive..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-white/70 text-xs tracking-widest uppercase text-center placeholder:text-white/20"
            />
          </div>
        </motion.div>

        {/* ── Orientation Filter Toggle ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center gap-6 mt-20"
        >
          {/* Mode label */}
          <AnimatePresence mode="wait">
            <motion.span
              key={activeMode}
              initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[10px] tracking-[0.4em] uppercase text-white/25 font-light"
            >
              {isPortrait ? 'Tall — Editorial Format' : 'Wide — Cinematic Format'}
            </motion.span>
          </AnimatePresence>

          {/* Toggle buttons */}
          <div className="flex items-center gap-1 p-1 border border-white/[0.07] rounded-sm backdrop-blur-sm bg-white/[0.02]">
            {MODES.map((mode, i) => {
              const isActive = activeMode === mode.id;
              return (
                <motion.button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`relative flex items-center gap-2.5 px-7 py-2.5 text-[10px] tracking-[0.3em] uppercase font-light transition-colors duration-700 rounded-[2px] ${isActive ? 'text-white' : 'text-white/25 hover:text-white/50'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Active background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 border border-white/15 bg-white/[0.05] rounded-[2px]"
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}

                  {/* Orientation glyph icon */}
                  <span
                    className={`relative z-10 text-[14px] leading-none transition-opacity duration-500 ${isActive ? 'opacity-80' : 'opacity-20'}`}
                    style={{ fontFamily: 'monospace' }}
                  >
                    {mode.glyph}
                  </span>

                  <span className="relative z-10">{mode.label}</span>

                  {/* Active dot */}
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative z-10 w-1 h-1 rounded-full bg-white/50 shrink-0"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Thin decorative rule */}
          <div className="flex items-center gap-4 w-64">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-[9px] tracking-[0.5em] uppercase text-white/15 font-light">
              {filteredArtworks.length} {filteredArtworks.length === 1 ? 'work' : 'works'}
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-white/10" />
          </div>
        </motion.div>

        {/* ── Gallery ── */}
        <div className={`explore-gallery relative z-10 ${isPortrait ? 'mt-[20vh]' : 'mt-[14vh]'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode}
              variants={galleryVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              {filteredArtworks.length > 0 ? (
                filteredArtworks.map((artwork, index) => {
                  return (
                    <motion.div
                      key={artwork.id}
                      variants={itemVariants}
                      className={`w-full mx-auto ${isPortrait
                          ? 'max-w-5xl mb-[42vh]'
                          : 'max-w-6xl mb-[28vh]'
                        }`}
                    >
                      <GalleryExhibit artwork={artwork} index={index} />
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="h-[50vh] flex flex-col items-center justify-center gap-4"
                >
                  <span className="text-white/10 text-5xl">
                    {isPortrait ? '▯' : '▭'}
                  </span>
                  <p className="text-white/20 tracking-[0.3em] uppercase text-xs">
                    No {activeMode} works found
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer gradient */}
        <div className="h-[40vh] w-full bg-gradient-to-b from-transparent to-[#030303]" />
      </div>
    </>
  );
}
