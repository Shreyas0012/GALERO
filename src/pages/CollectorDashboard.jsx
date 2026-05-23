import { Wallet, Heart, Package, History } from 'lucide-react';
import ArtworkCard from '../components/domain/ArtworkCard';
import { MOCK_DATA } from '../data/mock';
import './CollectorDashboard.css';

export default function CollectorDashboard() {
  const savedArtworks = [MOCK_DATA.artworks[0], MOCK_DATA.artworks[1]];
  
  return (
    <div className="dashboard-page container">
      <header className="dashboard-header">
        <div>
          <h1 className="font-display">Collector Vault</h1>
          <p className="text-muted">Manage your collected works, provenances, and saved items.</p>
        </div>
      </header>

      <div className="dashboard-stats grid md:grid-cols-4 gap-4">
        <div className="card stat-card">
          <div className="stat-card-icon"><Package size={20} /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Collected Works</span>
            <span className="stat-card-value">12</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon">Ξ</div>
          <div className="stat-card-info">
            <span className="stat-card-label">Est. Value</span>
            <span className="stat-card-value">14.5 ETH</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon"><Heart size={20} /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Saved Items</span>
            <span className="stat-card-value">24</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon"><Wallet size={20} /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Wallet</span>
            <span className="stat-card-value text-accent">0x8A...3F9</span>
          </div>
        </div>
      </div>

      <section className="dashboard-listings">
        <div className="section-header">
          <h2 className="font-display">Saved for Later</h2>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedArtworks.map(artwork => {
            const artist = MOCK_DATA.artists.find(a => a.id === artwork.artistId);
            return <ArtworkCard key={artwork.id} artwork={{ ...artwork, artist }} />;
          })}
        </div>
      </section>
    </div>
  );
}
