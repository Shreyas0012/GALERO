import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand text-center md:col-span-3 mb-12">
          <Link to="/" className="font-display text-4xl tracking-widest uppercase mb-4 inline-block text-white">
            Galero
          </Link>
          <p className="footer-tagline text-muted max-w-md mx-auto">
            A curated marketplace for provenance-backed digital and physical art.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4 className="footer-title">Explore</h4>
            <Link to="/explore">Marketplace</Link>
            <Link to="/collections">Collections</Link>
            <Link to="/dashboard/artist">Artists</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Platform</h4>
            <Link to="/onboard">Apply as Artist</Link>
            <Link to="#">Provenance</Link>
            <Link to="#">Phygital Works</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Connect</h4>
            <Link to="#">Twitter</Link>
            <Link to="#">Instagram</Link>
            <Link to="#">Journal</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Galero. All rights reserved.</p>
        <div className="footer-legal">
          <Link to="#">Terms</Link>
          <Link to="#">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
