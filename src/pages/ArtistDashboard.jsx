import { Link } from 'react-router-dom';
import { Plus, Settings, BarChart2, Package } from 'lucide-react';
import { MOCK_DATA } from '../data/mock';
import StatusPill from '../components/common/StatusPill';
import './ArtistDashboard.css';

export default function ArtistDashboard() {
  const artistId = "1"; // Mock logged-in artist
  const artist = MOCK_DATA.artists.find(a => a.id === artistId);
  const artworks = MOCK_DATA.artworks.filter(a => a.artistId === artistId);

  return (
    <div className="dashboard-page container">
      <header className="dashboard-header">
        <div>
          <h1 className="font-display">Dashboard</h1>
          <p className="text-muted">Welcome back, {artist?.name}</p>
        </div>
        <Link to="/create-listing" className="btn btn-primary flex items-center gap-2">
          <Plus size={18} /> New Listing
        </Link>
      </header>

      <div className="dashboard-stats grid md:grid-cols-4 gap-4">
        <div className="card stat-card">
          <div className="stat-card-icon"><Package size={20} /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Active Listings</span>
            <span className="stat-card-value">{artworks.filter(a => a.status === 'active').length}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon"><BarChart2 size={20} /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Total Sold</span>
            <span className="stat-card-value">{artworks.filter(a => a.status === 'sold').length}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon">Ξ</div>
          <div className="stat-card-info">
            <span className="stat-card-label">Total Earnings</span>
            <span className="stat-card-value">0.8 ETH</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon"><Settings size={20} /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Profile Status</span>
            <span className="stat-card-value text-accent">Verified</span>
          </div>
        </div>
      </div>

      <section className="dashboard-listings">
        <div className="section-header">
          <h2 className="font-display">Your Artworks</h2>
        </div>
        <div className="listings-table-container card">
          <table className="listings-table">
            <thead>
              <tr>
                <th>Artwork</th>
                <th>Type</th>
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artworks.map(artwork => (
                <tr key={artwork.id}>
                  <td>
                    <div className="table-artwork-cell">
                      <img src={artwork.images[0]} alt="" className="table-artwork-img" />
                      <span className="font-display">{artwork.title}</span>
                    </div>
                  </td>
                  <td><span className="badge">{artwork.editionType}</span></td>
                  <td>
                    <StatusPill status={artwork.status} />
                  </td>
                  <td>{artwork.price}</td>
                  <td>
                    <Link to={`/artwork/${artwork.id}`} className="text-accent hover-underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
