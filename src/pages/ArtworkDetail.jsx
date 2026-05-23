import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Clock, Share2, Heart } from 'lucide-react';
import { MOCK_DATA } from '../data/mock';
import './ArtworkDetail.css';

export default function ArtworkDetail() {
  const { id } = useParams();

  // For demo, just find by ID or default to first
  const artwork = MOCK_DATA.artworks.find(a => a.id === id) || MOCK_DATA.artworks[0];
  const artist = MOCK_DATA.artists.find(a => a.id === artwork.artistId);

  if (!artwork) {
    return <div className="container" style={{ paddingTop: '4rem' }}>Artwork not found</div>;
  }

  return (
    <div className="artwork-detail-page container">
      <div className="artwork-detail-layout">

        {/* Left Column: Visuals & Provenance */}
        <div className="artwork-detail-visuals">
          <div className="artwork-main-image-container">
            <img src={artwork.images[0]} alt={artwork.title} className="artwork-main-image" />
          </div>

          <div className="provenance-section">
            <h3 className="font-display section-title">Provenance & Authenticity</h3>
            <div className="provenance-timeline">
              {artwork.provenance.map((event, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-date text-muted">{event.date}</span>
                    <h4 className="timeline-event">{event.event}</h4>
                    <p className="timeline-details">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Purchase */}
        <div className="artwork-detail-info">
          <div className="artwork-header">
            <div className="artwork-tags">
              <span className="badge badge-accent">{artwork.editionType}</span>
              {artwork.status === 'active' && <span className="badge badge-outline">Available</span>}
            </div>

            <div className="artwork-actions">
              <button className="icon-btn" aria-label="Save"><Heart size={20} /></button>
              <button className="icon-btn" aria-label="Share"><Share2 size={20} /></button>
            </div>
          </div>

          <h1 className="artwork-title font-display">{artwork.title}</h1>

          <Link to={`/artist/${artist.id}`} className="artist-info-card">
            <img src={artist.avatar} alt={artist.name} className="artist-avatar" />
            <div>
              <p className="artist-name">
                {artist.name}
                {artist.isVerified && <ShieldCheck size={16} className="text-accent inline-icon" />}
              </p>
              <p className="artist-location text-muted">{artist.location}</p>
            </div>
          </Link>

          <div className="artwork-description">
            <p>{artwork.description}</p>
          </div>

          <div className="artwork-metadata-grid">
            <div className="metadata-item">
              <span className="metadata-label text-muted">Medium</span>
              <span className="metadata-value">{artwork.medium}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label text-muted">Year</span>
              <span className="metadata-value">{artwork.year}</span>
            </div>
            {artwork.dimensions && (
              <div className="metadata-item">
                <span className="metadata-label text-muted">Dimensions</span>
                <span className="metadata-value">{artwork.dimensions}</span>
              </div>
            )}
          </div>

          <div className="purchase-panel card">
            <div className="price-info">
              <span className="price-label text-muted">Current Price</span>
              <span className="price-value">{artwork.price}</span>
            </div>
            {artwork.status === 'active' ? (
              <button className="btn btn-primary purchase-btn">Acquire Artwork</button>
            ) : (
              <button className="btn btn-outline purchase-btn" disabled>Sold</button>
            )}
            <p className="purchase-guarantee text-muted text-center flex items-center justify-center gap-2">
              <ShieldCheck size={14} /> Backed by Galero Authenticity Guarantee
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
