import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Check, X, ShieldCheck, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AtmosphericBackground from '../components/layout/AtmosphericBackground';
import { MOCK_DATA } from '../data/mock';
import { artworksApi, collectionsApi, normalizeArtwork } from '../data/api';
import { useFetch } from '../hooks/useFetch';

// Fallback images if no cover image set
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=1200',
];

// Build a package deal object for a given set of artworks
function buildPackageDeal(collectionName, artworkPool) {
  if (!artworkPool || artworkPool.length === 0) return null;

  // Pick 2–4 paintings from this collection's pool (random slice)
  const count = Math.min(artworkPool.length, Math.max(2, Math.floor(Math.random() * 3) + 2));
  const shuffled = [...artworkPool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  // Price calculation
  let totalPrice = 0;
  let currency = 'ETH';
  let hasValidPrice = false;

  selected.forEach(art => {
    if (!art.price) return;
    const match = art.price.match(/([\d.]+)\s*([a-zA-Z$]+)/);
    if (match) {
      totalPrice += parseFloat(match[1]);
      currency = match[2];
      hasValidPrice = true;
    } else {
      const numOnly = art.price.match(/[\d.]+/);
      if (numOnly) {
        totalPrice += parseFloat(numOnly[0]);
        hasValidPrice = true;
      }
    }
  });

  const discountPercent = 15;
  const originalPrice = hasValidPrice ? `${totalPrice.toFixed(2)} ${currency}` : 'Price on Request';
  const packagePrice = hasValidPrice
    ? `${(totalPrice * (1 - discountPercent / 100)).toFixed(2)} ${currency}`
    : 'Exclusive Deal';

  const bundleNames = {
    2: 'The Transcendent Duo',
    3: "The Collector's Triad",
    4: 'The Ultimate Quartet',
  };

  return {
    collectionName,
    artworks: selected,
    originalPrice,
    packagePrice,
    discountPercent,
    bundleName: bundleNames[count] || 'The Premium Selection',
    description: `An exclusive package of ${count} curated works from the "${collectionName}" series — bundled together at a special collector's rate.`,
  };
}

export default function Collections() {
  const { data: rawCollections } = useFetch(collectionsApi.getAll);

  const collections = useMemo(() => {
    if (rawCollections && rawCollections.length > 0) return rawCollections;
    return MOCK_DATA.collections;
  }, [rawCollections]);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const { cart, addToCart, openCart } = useCart();
  // Which package deal modal is currently open (null = none)
  const [openDeal, setOpenDeal] = useState(null);
  // "Acquired" confirmation screen inside the modal
  const [acquired, setAcquired] = useState(false);

  const packageId = openDeal ? `package_${openDeal.collectionName.replace(/\s+/g, '_')}_${openDeal.bundleName.replace(/\s+/g, '_')}` : null;
  const isPackageInCart = openDeal && cart.some(item => item.id === packageId);

  const handleAcquirePackage = () => {
    if (!openDeal) return;
    if (isPackageInCart) {
      closeModal();
      openCart();
    } else {
      addToCart({
        id: packageId,
        itemType: 'package',
        ...openDeal
      });
      closeModal();
    }
  };

  // Fetch live artworks, fall back to mock
  const { data: rawArtworks } = useFetch(artworksApi.getAll);

  const allArtworks = useMemo(() => {
    if (rawArtworks && rawArtworks.length > 0) return rawArtworks.map(normalizeArtwork);
    return MOCK_DATA.artworks;
  }, [rawArtworks]);

  // Pre-compute a STABLE package deal for every collection once artworks are known.
  // Using useRef so the random selection is fixed for the lifetime of the page.
  const dealsRef = useRef({});

  const collectionDeals = useMemo(() => {
    if (!allArtworks || allArtworks.length === 0) return {};

    const result = {};
    (collections || []).forEach(collection => {
      // Only build once; reuse if already computed
      if (dealsRef.current[collection.id]) {
        result[collection.id] = dealsRef.current[collection.id];
        return;
      }

      const ids = (collection.artworks || []).map(String);
      let pool = allArtworks.filter(art => ids.includes(String(art.id)));

      // Supplement if not enough artwork in this collection
      if (pool.length < 2) {
        const extras = allArtworks.filter(art => !ids.includes(String(art.id)));
        pool = [...pool, ...extras].slice(0, 4);
      }

      const deal = buildPackageDeal(collection.name, pool);
      if (deal) {
        dealsRef.current[collection.id] = deal;
        result[collection.id] = deal;
      }
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allArtworks]);

  // Open the pre-computed package deal modal for a specific collection
  const handleViewSeries = (collection) => {
    const deal = collectionDeals[collection.id];
    if (deal) {
      setAcquired(false);
      setOpenDeal(deal);
    }
  };

  const closeModal = () => {
    setOpenDeal(null);
    setAcquired(false);
  };

  return (
    <>
      <AtmosphericBackground />

      <div className="container relative z-10 pb-[15vh]" style={{ paddingTop: '15vh' }}>

        {/* Cinematic Header */}
        <header className="flex flex-col items-center justify-center text-center mb-[10vh]" style={{ marginTop: '0vh' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] tracking-[0.5em] uppercase text-white/25 font-light mb-0"
          >
            Exclusive
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className={`font-display font-light tracking-tighter relative -top-2 ${isMobile ? 'text-4xl' : 'text-5xl'}`}
          >
            COLLECTIONS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            className="text-white/30 tracking-[0.2em] uppercase text-[10px] font-light max-w-xl mt-2"
          >
            Curated drops and editorial series
          </motion.p>
        </header>

        {/* Collections list */}
        {(!collections || collections.length === 0) ? (
          <div className="text-center mt-[10vh] text-white/20 tracking-[0.3em] text-[10px] uppercase">
            No collections yet — add some from the Admin Panel
          </div>
        ) : (
          <div className="flex flex-col gap-[12vh]">
            {collections.map((collection, index) => {
              const isEven = index % 2 === 0;
              const imgUrl = collection.coverImage || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

              return (
                <motion.div
                  key={collection.id}
                  className={`flex items-center gap-10 group ${isMobile ? 'flex-col' : isEven ? 'flex-row' : 'flex-row-reverse'}`}
                  initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Image Block */}
                  <div className={`w-full relative overflow-hidden ${isMobile ? 'h-[35vh] mb-4' : 'h-[45vh] flex-1'}`}>
                    <div className="absolute inset-[-20px] bg-white opacity-0 group-hover:opacity-[0.02] blur-2xl transition-opacity duration-[2000ms] pointer-events-none" />
                    <motion.div
                      className="w-full h-full bg-[#0a0a0a]"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <img
                        src={imgUrl}
                        alt={collection.name}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-opacity duration-1000 ${isMobile ? 'opacity-90' : 'opacity-70 group-hover:opacity-100'}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                  </div>

                  {/* Content Block */}
                  <div className={`w-full flex flex-col justify-center px-4 ${isMobile ? 'items-center text-center' : 'flex-1 items-start text-left p-12'}`}>
                    <span className="text-[9px] tracking-[0.4em] uppercase text-white/40 mb-4 flex items-center gap-3">
                      <span className={`w-4 h-[1px] bg-white/20 ${isMobile ? 'hidden' : 'block'}`} />
                      Featured Series
                    </span>

                    <h3 className={`font-display font-light tracking-wide text-white mb-6 ${isMobile ? 'text-3xl' : 'text-5xl'}`}>
                      {collection.name}
                    </h3>

                    <p className={`font-light leading-relaxed text-white/40 mb-10 font-sans ${isMobile ? 'text-sm' : 'text-base max-w-[80%]'}`}>
                      {collection.description}
                    </p>

                    <div className={`flex w-full items-center ${isMobile ? 'justify-between' : 'justify-start gap-12'} pt-6 border-t border-white/10`}>
                      <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-sans">
                        {collection.artworks ? collection.artworks.length : 0} Works
                      </span>

                      <button
                        onClick={() => handleViewSeries(collection)}
                        className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors duration-500 group/btn"
                      >
                        View Series
                        <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform duration-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Package Deal Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {openDeal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ paddingTop: '80px', paddingBottom: '30px' }}>

            {/* Backdrop — click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl bg-[#07090e] border border-white/[0.08] rounded-xl shadow-2xl z-10 flex flex-col overflow-hidden"
              style={{ maxHeight: 'calc(100vh - 130px)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Ambient glows — non-interactive */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-sky-500/4 rounded-full blur-[70px] pointer-events-none" />

              <AnimatePresence mode="wait">
                {!acquired ? (
                  /* ── Package Deal View ── */
                  <motion.div
                    key="deal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 flex flex-col overflow-hidden w-full flex-1 min-h-0"
                  >
                    {/* Fixed Header — never scrolls away */}
                    <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-white/[0.05] shrink-0">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-1 text-[8px] tracking-[0.3em] font-medium uppercase rounded-[2px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5 font-sans">
                            <Sparkles size={8} className="animate-pulse" />
                            Package Deal
                          </span>
                          <span className="px-2.5 py-1 text-[8px] tracking-[0.3em] font-medium uppercase rounded-[2px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-sans">
                            {openDeal.discountPercent}% Off
                          </span>
                        </div>
                        <p className="text-[9px] tracking-[0.3em] uppercase text-white/35 font-sans mb-0.5">
                          {openDeal.collectionName}
                        </p>
                        <h3 className="font-display font-light text-white text-xl md:text-2xl tracking-wide">
                          {openDeal.bundleName}
                        </h3>
                      </div>
                      {/* Close button — always on top */}
                      <button
                        onClick={closeModal}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200 rounded-full shrink-0 ml-4 mt-0.5"
                        style={{ zIndex: 10 }}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="overflow-y-auto px-6 py-5 flex-1 min-h-0" style={{ scrollbarWidth: 'none' }}>
                      <p className="text-white/40 text-sm font-light font-sans leading-relaxed mb-6 max-w-lg">
                        {openDeal.description}
                      </p>

                      {/* Paintings Grid — fixed height cells, equal columns */}
                      <div
                        className="mb-6"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: `repeat(${openDeal.artworks.length}, 1fr)`,
                          gap: '10px',
                        }}
                      >
                        {openDeal.artworks.map((art, idx) => (
                          <motion.div
                            key={art.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="group/art relative overflow-hidden rounded-sm border border-white/[0.07] bg-[#0a0a0a] hover:border-white/20 transition-all duration-700 h-[155px] sm:h-[250px]"
                          >
                            {/* Image */}
                            <img
                              src={art.images[0]}
                              alt={art.title}
                              className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover/art:opacity-95 group-hover/art:scale-[1.05] transition-all duration-[1.3s]"
                            />
                            {/* Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                            {/* Label */}
                            <div className="absolute inset-x-0 bottom-0 px-3 py-2.5">
                              <span className="block text-[7px] tracking-[0.2em] text-white/40 uppercase mb-0.5 font-sans truncate">
                                {art.medium}
                              </span>
                              <h4 className="text-[11px] leading-tight tracking-wide text-white font-medium font-sans truncate">
                                {art.title}
                              </h4>
                              <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/[0.07] opacity-0 group-hover/art:opacity-100 transition-opacity duration-300">
                                <span className="text-[9px] tracking-wider text-indigo-300 font-light font-sans">
                                  {art.price}
                                </span>
                                <Link
                                  to={`/artwork/${art.id}`}
                                  onClick={closeModal}
                                  className="text-white/40 hover:text-white transition-colors"
                                >
                                  <Eye size={11} />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Fixed Footer — never scrolls away */}
                    <div className="px-6 pt-7 pb-10 border-t border-white/[0.06] bg-[#07090e] shrink-0 rounded-b-xl z-20 min-h-[160px] sm:min-h-[110px] flex flex-col justify-center">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div>
                            <span className="block text-[8px] tracking-[0.2em] uppercase text-white/30 mb-0.5 font-sans">Original</span>
                            <span className="text-white/30 line-through text-sm font-light">{openDeal.originalPrice}</span>
                          </div>
                          <div className="border-l border-white/10 pl-5">
                            <span className="block text-[8px] tracking-[0.2em] uppercase text-indigo-300/60 mb-0.5 font-sans">Bundle Price</span>
                            <span className="font-display font-light text-2xl tracking-wide bg-gradient-to-r from-white via-indigo-200 to-indigo-300 bg-clip-text text-transparent">
                              {openDeal.packagePrice}
                            </span>
                          </div>
                        </div>

                        <motion.button
                          onClick={handleAcquirePackage}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full sm:w-auto px-7 py-4.5 text-[10px] tracking-[0.3em] uppercase font-semibold rounded-[2px] flex items-center justify-center gap-2.5 transition-all duration-300 group ${isPackageInCart ? 'bg-transparent border border-white/20 text-white hover:bg-white/5' : 'bg-transparent border border-white text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]'}`}
                        >
                          <ShoppingBag size={13} />
                          {isPackageInCart ? 'Already in Cart' : 'Acquire Bundle'}
                          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* ── Acquisition Confirmed View ── */
                  <motion.div
                    key="acquired"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 p-8 md:p-10 flex flex-col items-center text-center overflow-y-auto"
                    style={{ maxHeight: 'calc(100vh - 100px)', scrollbarWidth: 'none' }}
                  >
                    {/* Close */}
                    <button
                      onClick={closeModal}
                      className="absolute top-5 right-5 p-2 text-white/30 hover:text-white transition-colors rounded-full hover:bg-white/5"
                    >
                      <X size={16} />
                    </button>

                    {/* Success Icon */}
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 mt-2">
                      <ShieldCheck size={28} />
                    </div>

                    <span className="text-[9px] tracking-[0.4em] uppercase text-indigo-300 font-semibold mb-2 font-sans">
                      Transaction Secured
                    </span>
                    <h3 className="font-display font-light text-white text-2xl md:text-3xl mb-3 tracking-tight">
                      Bundle Acquired
                    </h3>
                    <p className="font-light text-white/45 text-sm leading-relaxed mb-6 max-w-md font-sans">
                      <span className="text-white/70">{openDeal.bundleName}</span> from the "{openDeal.collectionName}" series has been added to your private vault. Digital provenance has been minted to your wallet.
                    </p>

                    {/* Receipt */}
                    <div className="w-full max-w-sm flex flex-col gap-2 p-4 rounded-sm bg-white/[0.02] border border-white/5 mb-7 text-left">
                      <span className="text-[8px] tracking-[0.2em] uppercase text-white/35 mb-1 font-sans">
                        Acquired items ({openDeal.artworks.length})
                      </span>
                      {openDeal.artworks.map(art => (
                        <div key={art.id} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-b-0 font-sans">
                          <div className="flex items-center gap-2 truncate">
                            <Check size={11} className="text-emerald-400 shrink-0" />
                            <span className="text-white/75 text-xs font-medium truncate">{art.title}</span>
                          </div>
                          <span className="text-white/35 text-[10px] shrink-0 ml-2">{art.price}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.07] mt-1 font-sans">
                        <span className="text-indigo-200 text-xs">Total Paid</span>
                        <span className="font-display text-white text-sm tracking-wide font-light">{openDeal.packagePrice}</span>
                      </div>
                    </div>

                    <button
                      onClick={closeModal}
                      className="px-7 py-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-white text-[9px] tracking-[0.3em] uppercase font-semibold transition-all duration-300 rounded-[2px]"
                    >
                      Return to Collections
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
