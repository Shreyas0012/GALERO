import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, ArrowLeft, ArrowRight, LogOut, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, logout } = useAuth();
  const { cart, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <>
      <header className="navbar">
        <div className="container navbar-container">
          {/* Left: back/forward + hamburger */}
          <div className="navbar-left">
            {!isHome && (
              <div className="flex items-center gap-2">
                <button
                  className="opacity-60 hover:opacity-100 transition-opacity text-white"
                  aria-label="Go Back"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  className="opacity-60 hover:opacity-100 transition-opacity text-white"
                  aria-label="Go Forward"
                  onClick={() => navigate(1)}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
            <button
              className="menu-btn"
              aria-label="Menu"
              onClick={() => setMenuOpen(prev => !prev)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Center: desktop nav links */}
          <nav className="navbar-links">
            <Link to="/explore">Explore</Link>
            <Link to="/collections">Collections</Link>
            {user?.role === 'ARTIST' && <Link to="/dashboard/artist">Artist Dashboard</Link>}
            {user?.role === 'ADMIN' && <Link to="/admin" className="text-accent">Admin Panel</Link>}
          </nav>

          {/* Right: search + cart + user (desktop) / user icon (mobile) */}
          <div className="navbar-actions">
            <button className="icon-btn" aria-label="Search">
              <Search size={18} />
            </button>

            {/* Shopping Cart Trigger */}
            <button className="cart-trigger-btn" onClick={openCart} aria-label="Open Acquisitions Drawer">
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span className="cart-badge-pulse">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Desktop: full user info */}
            <div className="navbar-user-desktop">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs opacity-70 flex items-center gap-1.5">
                    <User size={14} />
                    <span className="hidden-name">{user.name}</span>
                  </span>
                  <button
                    onClick={logout}
                    className="text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-500 flex items-center gap-1"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-700"
                >
                  [ Login ]
                </Link>
              )}
            </div>

            {/* Mobile: just user icon */}
            <div className="navbar-user-mobile">
              {user ? (
                <button
                  onClick={() => setMenuOpen(prev => !prev)}
                  className="icon-btn"
                  aria-label="User menu"
                >
                  <User size={18} />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-[10px] uppercase tracking-[0.15em] text-white/60"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Dropdown Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mobile-menu"
            >
              {/* Nav Links */}
              <nav className="mobile-menu-links">
                <Link to="/explore" onClick={closeMenu}>Explore</Link>
                <Link to="/collections" onClick={closeMenu}>Collections</Link>
                {user?.role === 'ARTIST' && (
                  <Link to="/dashboard/artist" onClick={closeMenu}>Artist Dashboard</Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" onClick={closeMenu} className="text-accent">Admin Panel</Link>
                )}
              </nav>

              {/* User Section */}
              <div className="mobile-menu-footer">
                {user ? (
                  <>
                    <div className="mobile-menu-user">
                      <User size={14} />
                      <span>{user.name}</span>
                      <span className="mobile-menu-role">({user.role})</span>
                    </div>
                    <button onClick={handleLogout} className="mobile-menu-logout">
                      <LogOut size={14} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={closeMenu} className="mobile-menu-login">
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
