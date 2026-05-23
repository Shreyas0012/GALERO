import { ShieldAlert, Users, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import StatusPill from '../components/common/StatusPill';
import { MOCK_DATA } from '../data/mock';
import './AdminPanel.css';

export default function AdminPanel() {
  const pendingArtists = MOCK_DATA.artists.filter(a => !a.isVerified);
  
  return (
    <div className="dashboard-page container">
      <header className="dashboard-header">
        <div>
          <h1 className="font-display flex items-center gap-2">
            <ShieldAlert size={28} className="text-accent" />
            Curator Command Center
          </h1>
          <p className="text-muted">Review applications, flag listings, and manage curation.</p>
        </div>
      </header>

      <div className="dashboard-stats grid md:grid-cols-4 gap-4">
        <div className="card stat-card">
          <div className="stat-card-icon"><Users size={20} /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Pending Artists</span>
            <span className="stat-card-value">{pendingArtists.length || 0}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon"><ImageIcon size={20} /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Pending Artworks</span>
            <span className="stat-card-value">3</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon"><AlertTriangle size={20} /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Reported</span>
            <span className="stat-card-value text-error">1</span>
          </div>
        </div>
      </div>

      <section className="dashboard-listings mt-12">
        <div className="section-header">
          <h2 className="font-display">Recent Activity</h2>
        </div>
        <div className="listings-table-container card">
          <table className="listings-table">
            <thead>
              <tr>
                <th>Entity</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Elena Rostova</strong> (Artist Application)</td>
                <td><span className="badge">User</span></td>
                <td><StatusPill status="verified" /></td>
                <td><button className="text-accent hover-underline">Review</button></td>
              </tr>
              <tr>
                <td><strong>Concrete Reverie</strong> (Artwork Submission)</td>
                <td><span className="badge">Digital 1/1</span></td>
                <td><StatusPill status="pending review" /></td>
                <td><button className="text-accent hover-underline">Review</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
