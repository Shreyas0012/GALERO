import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Check, Sparkles, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    clearCart,
    getTotals
  } = useCart();

  const navigate = useNavigate();
  
  // Checkout flow state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [expandedPackage, setExpandedPackage] = useState({}); // { [itemId]: boolean }

  // Form states
  const [collectorName, setCollectorName] = useState('');
  const [collectorEmail, setCollectorEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [processingMsg, setProcessingMsg] = useState('');

  const totals = getTotals();
  const hasEth = totals.ETH.final > 0;
  const hasUsd = totals.USD.final > 0;

  const togglePackageExpand = (itemId) => {
    setExpandedPackage(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleStartCheckout = () => {
    setIsCheckingOut(true);
    setCheckoutStep('form');
  };

  const handleCancelCheckout = () => {
    setIsCheckingOut(false);
    setCheckoutStep('form');
    setFormError('');
  };

  const handleCompleteAcquisition = (e) => {
    e.preventDefault();
    if (!collectorName || !collectorEmail) {
      setFormError('Please complete all collector details.');
      return;
    }
    setFormError('');
    setCheckoutStep('processing');

    const messages = [
      'Authenticating private digital key signature...',
      'Minting ERC-721 digital twin on blockchain...',
      'Securing physical provenance credentials...',
      'Publishing decentralized metadata hash...',
      'Vault transfer finalized! Provenance registered.'
    ];

    let msgIdx = 0;
    setProcessingMsg(messages[0]);
    
    const interval = setInterval(() => {
      msgIdx++;
      if (msgIdx < messages.length) {
        setProcessingMsg(messages[msgIdx]);
      }
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      // Generate random transaction hash
      const hex = '0123456789abcdef';
      let hash = '0x';
      for (let i = 0; i < 40; i++) hash += hex[Math.floor(Math.random() * 16)];
      setTxHash(hash);
      setCheckoutStep('success');
    }, 4000);
  };

  const handleFinish = () => {
    clearCart();
    setIsCheckingOut(false);
    setCheckoutStep('form');
    closeCart();
  };

  const handleExplore = () => {
    closeCart();
    navigate('/explore');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
            className="cart-backdrop"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="cart-drawer-panel"
          >
            {/* Ambient glows */}
            <div className="absolute top-0 left-0 w-[250px] h-[250px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-sky-500/4 rounded-full blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="cart-header">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-indigo-400" />
                <h3 className="font-display text-white text-lg tracking-wide uppercase font-light">
                  {isCheckingOut ? 'Vault Acquisition' : 'Acquisitions Drawer'}
                </h3>
                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 text-white/60 rounded font-sans">
                  {cart.length}
                </span>
              </div>
              <button onClick={closeCart} className="cart-close-btn">
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="cart-body">
              {cart.length === 0 ? (
                /* ── EMPTY STATE ── */
                <div className="flex flex-col items-center justify-center text-center py-20 px-6 h-full">
                  <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/35 mb-6">
                    <ShoppingBag size={20} />
                  </div>
                  <h4 className="font-display font-light text-white text-base tracking-wider mb-2">
                    VAULT IS EMPTY
                  </h4>
                  <p className="text-white/40 text-xs font-light font-sans max-w-[240px] leading-relaxed mb-8">
                    You have not selected any individual masterpieces or collection package deals yet.
                  </p>
                  <button onClick={handleExplore} className="cart-explore-btn font-sans">
                    Browse the Archive
                  </button>
                </div>
              ) : !isCheckingOut ? (
                /* ── CART LIST VIEW ── */
                <div className="flex flex-col h-full justify-between">
                  {/* Items list */}
                  <div className="overflow-y-auto pr-1 flex-1 py-4 flex flex-col gap-4" style={{ scrollbarWidth: 'none' }}>
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item-card">
                        <div className="flex gap-4 items-start">
                          {/* Image */}
                          <div className="cart-item-image-wrapper">
                            <img
                              src={item.itemType === 'package' ? item.artworks[0].images[0] : item.images[0]}
                              alt={item.itemType === 'package' ? item.bundleName : item.title}
                              className="cart-item-image"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            {item.itemType === 'package' ? (
                              /* Package Info */
                              <div>
                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                  <span className="px-1.5 py-0.5 text-[7px] tracking-wider uppercase font-semibold rounded-[2px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-sans">
                                    Package Deal
                                  </span>
                                  <span className="px-1.5 py-0.5 text-[7px] tracking-wider uppercase font-semibold rounded-[2px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-sans">
                                    {item.discountPercent}% Off
                                  </span>
                                </div>
                                <h4 className="text-white text-sm font-medium tracking-wide font-sans truncate mb-0.5">
                                  {item.bundleName}
                                </h4>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-sans mb-2 truncate">
                                  {item.collectionName}
                                </p>
                              </div>
                            ) : (
                              /* Painting Info */
                              <div>
                                <h4 className="text-white text-sm font-medium tracking-wide font-sans truncate mb-0.5">
                                  {item.title}
                                </h4>
                                <p className="text-[10px] text-indigo-300 font-sans mb-1">
                                  {item.artist ? item.artist.name : 'Unknown Artist'}
                                </p>
                                <p className="text-[9px] text-white/35 uppercase tracking-wider font-sans mb-2">
                                  {item.medium}
                                </p>
                              </div>
                            )}

                            {/* Pricing and Details */}
                            <div className="flex items-center justify-between mt-1">
                              {item.itemType === 'package' ? (
                                <div className="flex items-baseline gap-2">
                                  <span className="text-white/30 line-through text-[11px] font-sans">
                                    {item.originalPrice}
                                  </span>
                                  <span className="text-indigo-200 text-sm font-medium font-sans">
                                    {item.packagePrice}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-white/70 text-sm font-medium font-sans">
                                  {item.price}
                                </span>
                              )}

                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-white/20 hover:text-red-400 p-1.5 transition-colors duration-200"
                                aria-label="Remove item"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Package Accordion */}
                        {item.itemType === 'package' && (
                          <div className="mt-3 pt-3 border-t border-white/[0.04]">
                            <button
                              onClick={() => togglePackageExpand(item.id)}
                              className="flex items-center gap-1.5 text-[9px] tracking-wider text-white/45 hover:text-white/80 transition-colors uppercase font-sans font-medium"
                            >
                              {expandedPackage[item.id] ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                              Included Works ({item.artworks.length})
                            </button>
                            
                            <AnimatePresence>
                              {expandedPackage[item.id] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="flex flex-col gap-2 mt-2 pl-3 border-l border-white/[0.06] py-1">
                                    {item.artworks.map(art => (
                                      <div key={art.id} className="flex items-center justify-between text-[11px] font-sans">
                                        <span className="text-white/60 truncate max-w-[160px]">
                                          {art.title}
                                        </span>
                                        <span className="text-white/30 shrink-0">
                                          {art.price}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Summary Block */}
                  <div className="cart-footer shrink-0">
                    <div className="flex flex-col gap-2 mb-6">
                      <h5 className="text-[9px] tracking-[0.2em] uppercase text-white/35 font-sans mb-1">
                        Acquisitions Summary
                      </h5>
                      
                      {/* ETH Pricing details */}
                      {hasEth && (
                        <div className="flex flex-col gap-1 border-b border-white/[0.04] pb-2 mb-1">
                          {totals.ETH.savings > 0 && (
                            <>
                              <div className="flex justify-between text-[11px] font-sans text-white/45">
                                <span>Original Subtotal</span>
                                <span>{totals.ETH.original.toFixed(2)} ETH</span>
                              </div>
                              <div className="flex justify-between text-[11px] font-sans text-emerald-400">
                                <span>Bundle Savings (15%)</span>
                                <span>-{totals.ETH.savings.toFixed(2)} ETH</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between text-sm font-sans font-medium text-white">
                            <span>Total (ETH Works)</span>
                            <span className="text-indigo-200">{totals.ETH.final.toFixed(2)} ETH</span>
                          </div>
                        </div>
                      )}

                      {/* USD Pricing details */}
                      {hasUsd && (
                        <div className="flex flex-col gap-1">
                          {totals.USD.savings > 0 && (
                            <>
                              <div className="flex justify-between text-[11px] font-sans text-white/45">
                                <span>Original Subtotal</span>
                                <span>${totals.USD.original.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                              </div>
                              <div className="flex justify-between text-[11px] font-sans text-emerald-400">
                                <span>Bundle Savings (15%)</span>
                                <span>-${totals.USD.savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between text-sm font-sans font-medium text-white">
                            <span>Total (USD Works)</span>
                            <span className="text-indigo-200">
                              ${totals.USD.final.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button onClick={handleStartCheckout} className="cart-checkout-btn uppercase font-semibold font-sans flex items-center justify-center gap-2.5">
                      <ShieldCheck size={14} />
                      Proceed to Secure Checkout
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                /* ── SECURE CHECKOUT VIEWS ── */
                <div className="h-full flex flex-col">
                  {checkoutStep === 'form' && (
                    <form onSubmit={handleCompleteAcquisition} className="flex flex-col h-full justify-between py-2">
                      <div className="flex flex-col gap-5 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[2px] flex items-start gap-3">
                          <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <h5 className="text-xs text-white font-medium mb-1 font-sans">
                              Decentralized Vault Registry
                            </h5>
                            <p className="text-[10px] text-white/45 font-sans leading-relaxed">
                              Your physical masterwork provenance rights and digital twin certificates will be cryptographicly signed and minted directly to your ownership registers.
                            </p>
                          </div>
                        </div>

                        {formError && (
                          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-sans flex items-center gap-2 rounded-[2px]">
                            <AlertCircle size={14} />
                            {formError}
                          </div>
                        )}

                        <div className="flex flex-col gap-4 mt-1">
                          <div className="form-group flex flex-col gap-1.5">
                            <label className="text-[9px] tracking-wider uppercase text-white/45 font-sans font-semibold">
                              Collector Account Name
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Charlotte de Beaumont"
                              value={collectorName}
                              onChange={(e) => setCollectorName(e.target.value)}
                              className="cart-input"
                            />
                          </div>

                          <div className="form-group flex flex-col gap-1.5">
                            <label className="text-[9px] tracking-wider uppercase text-white/45 font-sans font-semibold">
                              Secure Contact Email
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="e.g. charlotte@beaumont.art"
                              value={collectorEmail}
                              onChange={(e) => setCollectorEmail(e.target.value)}
                              className="cart-input"
                            />
                          </div>

                          <div className="form-group flex flex-col gap-1.5">
                            <label className="text-[9px] tracking-wider uppercase text-white/45 font-sans font-semibold flex items-center justify-between">
                              <span>Ownership Register Wallet Address</span>
                              <span className="text-[8px] text-white/25">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 0x71C...B29"
                              value={walletAddress}
                              onChange={(e) => setWalletAddress(e.target.value)}
                              className="cart-input font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="cart-footer shrink-0">
                        <button type="submit" className="cart-checkout-btn uppercase font-semibold font-sans flex items-center justify-center gap-2 mb-3">
                          <Check size={14} />
                          Finalize Secure Acquisition
                        </button>
                        <button type="button" onClick={handleCancelCheckout} className="w-full text-center py-2.5 text-white/40 hover:text-white text-[9px] tracking-[0.2em] uppercase font-sans transition-colors duration-200">
                          Cancel & Return
                        </button>
                      </div>
                    </form>
                  )}

                  {checkoutStep === 'processing' && (
                    <div className="flex flex-col items-center justify-center text-center py-24 px-6 h-full">
                      <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
                        <div className="absolute inset-0 border-[3px] border-white/5 rounded-full" />
                        <div className="absolute inset-0 border-[3px] border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        <Sparkles size={18} className="text-indigo-400 animate-pulse" />
                      </div>
                      
                      <h4 className="font-display font-light text-white text-base tracking-wider mb-3">
                        PROCESSING SECURE TRANSFER
                      </h4>
                      <p className="text-white/40 text-[11px] font-sans max-w-[260px] leading-relaxed animate-pulse">
                        {processingMsg}
                      </p>
                    </div>
                  )}

                  {checkoutStep === 'success' && (
                    <div className="flex flex-col h-full justify-between py-2">
                      <div className="flex flex-col items-center text-center overflow-y-auto pr-1 py-4" style={{ scrollbarWidth: 'none' }}>
                        {/* Success Icon */}
                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                          <ShieldCheck size={28} />
                        </div>

                        <span className="text-[8px] tracking-[0.4em] uppercase text-indigo-300 font-semibold mb-2 font-sans">
                          Blockchain Secured
                        </span>
                        <h4 className="font-display font-light text-white text-xl md:text-2xl mb-3 tracking-wide uppercase">
                          Acquisition Finalized
                        </h4>
                        <p className="font-light text-white/45 text-xs leading-relaxed mb-6 max-w-xs font-sans">
                          Congratulations, <span className="text-white/75">{collectorName}</span>. Your masterpiece digital twin credentials and physical ownership registry certificates have been issued.
                        </p>

                        {/* Transaction Receipt */}
                        <div className="w-full flex flex-col gap-2.5 p-4 rounded-sm bg-white/[0.01] border border-white/5 text-left mb-6 font-sans">
                          <div className="flex justify-between items-center text-[10px] text-white/30 border-b border-white/[0.04] pb-2">
                            <span>REGISTRY RECEIPT</span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[8px] tracking-wider uppercase text-white/30">Acquired Items</span>
                            {cart.map(item => (
                              <div key={item.id} className="flex justify-between items-center text-xs">
                                <span className="text-white/75 truncate max-w-[170px]">{item.itemType === 'package' ? item.bundleName : item.title}</span>
                                <span className="text-white/40 shrink-0 text-[10px] ml-2">
                                  {item.itemType === 'package' ? item.packagePrice : item.price}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col gap-1 border-t border-white/[0.04] pt-2 mt-1">
                            <span className="text-[8px] tracking-wider uppercase text-white/30">Provenance Hash</span>
                            <span className="text-[10px] text-indigo-300 font-mono break-all leading-normal bg-indigo-500/5 px-2 py-1 border border-indigo-500/10 rounded-[2px]">
                              {txHash}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="cart-footer shrink-0">
                        <button onClick={handleFinish} className="cart-checkout-btn uppercase font-semibold font-sans">
                          Return to Archive
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
