import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

// Shared metadata block
function MetaBlock({ title, artist, year, description, medium, editionType, price, align = 'left' }) {
  const isRight = align === 'right';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div className={`flex flex-col ${isRight ? (isMobile ? 'items-center text-center' : 'items-end text-right') : (isMobile ? 'items-center text-center' : 'items-start text-left')} z-20 max-w-[380px] w-full ${isMobile ? 'px-6' : 'px-0'}`}>
      <h4 className={`font-display font-light tracking-wide text-white mb-2 transform ${isMobile ? '' : (isRight ? 'translate-x-4' : '-translate-x-4')} group-hover:translate-x-0 transition-transform duration-1000 ease-out ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
        {title}
      </h4>
      <p className={`tracking-widest uppercase text-white/50 mb-4 transform ${isMobile ? '' : (isRight ? 'translate-x-2' : '-translate-x-2')} group-hover:translate-x-0 transition-transform duration-1000 delay-75 ease-out ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
        {artist?.name || 'Unknown Artist'}{year && <span className="opacity-40"> — {year}</span>}
      </p>

      {description && (
        <p className={`font-light leading-relaxed text-white/35 mb-7 transform ${isMobile ? '' : (isRight ? 'translate-x-2' : '-translate-x-2')} group-hover:translate-x-0 transition-transform duration-1000 delay-100 ease-out ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>
      )}

      {/* Hover Reveal Tags */}
      <div className={`transform ${isMobile ? '' : (isRight ? 'translate-x-4' : '-translate-x-4')} group-hover:translate-x-0 transition-all duration-1000 delay-150 ease-out flex flex-col ${isMobile ? 'items-center' : (isRight ? 'items-end' : 'items-start')} tracking-widest uppercase text-white/50 ${isMobile ? 'opacity-100 gap-2 text-[9px]' : 'opacity-0 group-hover:opacity-100 gap-3 text-[10px]'}`}>
        {[medium, editionType, price].filter(Boolean).map((val, i) => (
          <div key={i} className={`flex items-center gap-3 ${!isMobile && isRight ? 'flex-row-reverse' : ''}`}>
            <span className={`w-5 h-[1px] bg-white/25 shrink-0 ${isMobile ? 'hidden' : 'block'}`} />
            <span>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Portrait layout: tall image on left, metadata vertically centered on right
function PortraitExhibit({ artwork }) {
  const { id, title, medium, price, images, editionType, artist, description, year } = artwork;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  return (
    <div className={`flex items-center gap-8 md:gap-28 w-full px-4 md:px-0 ${isMobile ? 'flex-col' : 'flex-row'}`}>
      {/* Image — left, rigidly 3:4 portrait */}
      <div className={`w-full flex justify-center ${isMobile ? '' : 'flex-1 justify-end'}`}>
        <Link
          to={`/artwork/${id}`}
          className="block relative shrink-0 cursor-pointer rounded-sm"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <div className="absolute inset-[-20px] bg-white opacity-0 group-hover:opacity-[0.03] blur-2xl transition-opacity duration-[2000ms] pointer-events-none hidden min-[500px]:block" />
          <motion.div
            className="relative overflow-hidden bg-[#0a0a0a] rounded-sm"
            whileHover={{ scale: 1.03, y: -8 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src={images[0]}
              alt={title}
              className="w-full h-auto object-contain opacity-100 min-[500px]:opacity-90 min-[500px]:group-hover:opacity-100 transition-opacity duration-1000"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none hidden min-[500px]:block" />
          </motion.div>
        </Link>
      </div>

      {/* Metadata — right */}
      <div className={`w-full flex justify-center ${isMobile ? '' : 'flex-1 justify-start'}`}>
        <MetaBlock title={title} artist={artist} year={year} description={description} medium={medium} editionType={editionType} price={price} align="left" />
      </div>
    </div>
  );
}

// Landscape layout: wide image top-spanning, metadata below-right as editorial caption
function LandscapeExhibit({ artwork }) {
  const { id, title, medium, price, images, editionType, artist, description, year } = artwork;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div className={`flex items-center gap-4 w-full px-4 md:px-0 ${isMobile ? 'flex-col' : 'flex-row gap-12'}`}>
      {/* Wide image — left side */}
      <div className={`w-full flex justify-center ${isMobile ? '' : 'w-2/3 justify-end'}`}>
        <Link
          to={`/artwork/${id}`}
          className={`block relative w-full cursor-pointer overflow-hidden rounded-sm aspect-[16/9] ${isMobile ? '' : 'aspect-[16/7]'}`}
        >
          <div className={`absolute inset-[-20px] bg-white opacity-0 blur-2xl transition-opacity duration-[2000ms] pointer-events-none ${isMobile ? 'hidden' : 'group-hover:opacity-[0.03] block'}`} />
          <motion.div
            className="absolute inset-0 overflow-hidden bg-[#0a0a0a]"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src={images[0]}
              alt={title}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${isMobile ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Title overlay inside image bottom-left */}
            <div className={`absolute pointer-events-none ${isMobile ? 'bottom-4 left-4' : 'bottom-6 left-8'}`}>
              <h4 className={`font-display font-light tracking-wide text-white drop-shadow-lg ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                {title}
              </h4>
              <p className={`tracking-widest uppercase mt-1 ${isMobile ? 'text-[9px] text-white/80' : 'text-xs text-white/60'}`}>
                {artist?.name || 'Unknown Artist'}{year && <span className="opacity-50"> — {year}</span>}
              </p>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Metadata — right side */}
      <div className={`w-full flex px-2 ${isMobile ? 'justify-center' : 'w-1/3 justify-start'}`}>
        <div className={`flex flex-col max-w-[500px] ${isMobile ? 'items-center text-center' : 'items-start text-left'}`}>
          {description && (
            <p className="text-xs min-[500px]:text-sm font-light leading-relaxed text-white/35 mb-4 min-[500px]:mb-5 transform min-[500px]:translate-x-2 min-[500px]:group-hover:translate-x-0 transition-transform duration-1000 delay-100 ease-out">
              {description}
            </p>
          )}
          {/* Tags */}
          <div className="opacity-100 min-[500px]:opacity-0 min-[500px]:group-hover:opacity-100 transition-opacity duration-1000 delay-150 flex flex-wrap justify-center min-[500px]:flex-row gap-4 min-[500px]:gap-8 text-[9px] min-[500px]:text-[10px] tracking-widest uppercase text-white/50">
            {[medium, editionType, price].filter(Boolean).map((val, i) => (
              <span key={i}>{val}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryExhibit({ artwork, index }) {
  const ref = useRef(null);
  const isLandscape = artwork.orientation === 'landscape';

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale }}
      className="relative group w-full"
      initial={{ filter: 'blur(12px)' }}
      whileInView={{ filter: 'blur(0px)' }}
      viewport={{ once: false, margin: '-10%' }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {isLandscape ? (
        <LandscapeExhibit artwork={artwork} />
      ) : (
        <PortraitExhibit artwork={artwork} />
      )}
    </motion.div>
  );
}
