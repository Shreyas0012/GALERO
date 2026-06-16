import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, ArrowLeft, ArrowRight, LogOut, ShoppingBag, Compass, Layers, Palette, Settings } from 'lucide-react';
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
            <Link to="/" className="navbar-logo">
              Galero
            </Link>
          </div>


          {/* Center: desktop nav links (Clean text list matching Hubtown) */}
          <nav className="navbar-links">
            <Link to="/explore" className="nav-icon-link">
              <span className="nav-text-label">Explore</span>
            </Link>
            <Link to="/collections" className="nav-icon-link">
              <span className="nav-text-label">Collections</span>
            </Link>
            {user?.role === 'ARTIST' && (
              <Link to="/dashboard/artist" className="nav-icon-link">
                <span className="nav-text-label">Artist Dashboard</span>
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="nav-icon-link text-accent">
                <span className="nav-text-label">Admin Panel</span>
              </Link>
            )}
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

            {/* Desktop: user profile and logout icons */}
            <div className="navbar-user-desktop">
              {user ? (
                <div className="flex flex-col items-center gap-4">
                  <Link
                    to={user.role === 'ARTIST' ? '/dashboard/artist' : '/'}
                    className="icon-btn"
                    title={`Profile: ${user.name}`}
                  >
                    <User size={18} />
                  </Link>
                  <button
                    onClick={logout}
                    className="icon-btn"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="icon-btn"
                  title="Login"
                >
                  <User size={18} />
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
