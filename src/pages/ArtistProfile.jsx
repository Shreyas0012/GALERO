import { useParams } from 'react-router-dom';
import { ShieldCheck, MapPin, Calendar } from 'lucide-react';
import { MOCK_DATA } from '../data/mock';
import ArtworkCard from '../components/domain/ArtworkCard';
import './ArtistProfile.css';

export default function ArtistProfile() {
  const { id } = useParams();
  
  const artist = MOCK_DATA.artists.find(a => a.id === id) || MOCK_DATA.artists[0];
  const artistArtworks = MOCK_DATA.artworks.filter(a => a.artistId === artist.id);

  if (!artist) {
    return <div className="container" style={{paddingTop: '4rem'}}>Artist not found</div>;
  }

  return (
    <div className="artist-profile-page container">
      {/* Artist Header */}
      <header className="artist-header">
        <img src={artist.avatar} alt={artist.name} className="artist-profile-avatar" />
        <div className="artist-profile-info">
          <h1 className="font-display">
            {artist.name}
            {artist.isVerified && <ShieldCheck size={24} className="text-accent inline-icon" style={{ marginLeft: '8px' }} />}
          </h1>
          
          <div className="artist-meta text-muted">
            <span className="flex items-center gap-2"><MapPin size={16} /> {artist.location}</span>
            <span className="flex items-center gap-2"><Calendar size={16} /> Joined {new Date(artist.joined).getFullYear()}</span>
          </div>

          <p className="artist-bio">{artist.bio}</p>

          <div className="artist-stats">
            <div className="stat">
              <span className="stat-value">{artistArtworks.length}</span>
              <span className="stat-label text-muted">Artworks</span>
            </div>
            <div className="stat">
              <span className="stat-value">{artistArtworks.filter(a => a.status === 'sold').length}</span>
              <span className="stat-label text-muted">Collected</span>
            </div>
          </div>
        </div>
      </header>

      {/* Portfolio Grid */}
      <section className="artist-portfolio">
        <h2 className="font-display section-title">Portfolio</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artistArtworks.length > 0 ? (
            artistArtworks.map(artwork => (
              <ArtworkCard key={artwork.id} artwork={{ ...artwork, artist }} />
            ))
          ) : (
            <p className="text-muted">No artworks listed yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
