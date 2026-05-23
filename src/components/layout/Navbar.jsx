import { Link } from 'react-router-dom';
import { Menu, Search, User } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-container">
        <div className="navbar-left">
          <button className="menu-btn" aria-label="Menu">
            <Menu size={24} />
          </button>
          <Link to="/" className="navbar-logo font-display">
            Galero
          </Link>
        </div>

        <nav className="navbar-links">
          <Link to="/explore">Explore</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/dashboard/artist">Artists</Link>
        </nav>

        <div className="navbar-actions">
          <button className="icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <Link to="/dashboard/collector" className="icon-btn" aria-label="Account">
            <User size={20} />
          </Link>
          <Link to="/onboard" className="btn btn-primary">
            Connect
          </Link>
        </div>
      </div>
    </header>
  );
}
