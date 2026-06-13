import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import FloatingActions from './components/layout/FloatingActions';
import AppLayout from './components/layout/AppLayout';
import CartDrawer from './components/layout/CartDrawer';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import ArtworkDetail from './pages/ArtworkDetail';

import ArtistProfile from './pages/ArtistProfile';
import ArtistDashboard from './pages/ArtistDashboard';
import Onboard from './pages/Onboard';
import CreateListing from './pages/CreateListing';
import Collections from './pages/Collections';
import LoadingScreen from './components/layout/LoadingScreen';

import AdminPanel from './pages/AdminPanel';

import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Placeholder components for unbuilt pages
const CollectorDashboard = () => <div className="container" style={{padding: '4rem 0'}}>Collector Dashboard</div>;

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading screen for 2s on load
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only initialize Lenis on desktop / non-touch screens to avoid mobile scrolling lockups
    const isMobileDevice = window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isMobileDevice) {
      window.lenis = null;
      return;
    }

    const lenis = new Lenis({
      duration: 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.5,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    
    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      window.lenis = null;
    };
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <ScrollToTop />
      <FloatingActions />
      <CartDrawer />
      <Routes>
        {/* Full-screen auth pages (without global Navbar/Footer) */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Main Application Layout pages */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Landing />} />
          <Route path="explore" element={<Explore />} />
          <Route path="artwork/:id" element={<ArtworkDetail />} />
          <Route path="artist/:id" element={<ArtistProfile />} />
          <Route path="collections" element={<Collections />} />

          {/* Protected Routes */}
          <Route path="dashboard/artist" element={
            <ProtectedRoute allowedRoles={['ARTIST', 'ADMIN']}>
              <ArtistDashboard />
            </ProtectedRoute>
          } />
          <Route path="dashboard/collector" element={
            <ProtectedRoute allowedRoles={['BUYER', 'ADMIN']}>
              <CollectorDashboard />
            </ProtectedRoute>
          } />
          <Route path="admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          
          <Route path="onboard" element={<Onboard />} />
          <Route path="create-listing" element={<CreateListing />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
