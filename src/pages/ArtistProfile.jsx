import { useParams } from 'react-router-dom';
import { ShieldCheck, MapPin, Calendar } from 'lucide-react';
import { useState, useMemo } from 'react';
import { MOCK_DATA } from '../data/mock';
import { artistsApi, artworksApi, normalizeArtist, normalizeArtwork } from '../data/api';
import { useFetch } from '../hooks/useFetch';
import ArtworkCard from '../components/domain/ArtworkCard';
import './ArtistProfile.css';

export default function ArtistProfile() {
  const { id } = useParams();
  
  // Fetch live artist and all artworks
  const { data: rawArtist, loading: loadingArtist } = useFetch(() => artistsApi.getById(id), [id]);
  const { data: rawArtworks, loading: loadingArtworks } = useFetch(artworksApi.getAll, []);

  const artist = useMemo(() => {
    if (rawArtist) return normalizeArtist(rawArtist);
    return MOCK_DATA.artists.find(a => String(a.id) === String(id)) || MOCK_DATA.artists[0];
  }, [rawArtist, id]);

  const artistArtworks = useMemo(() => {
    if (rawArtworks && rawArtworks.length > 0) {
      const normalized = rawArtworks.map(normalizeArtwork);
      const filtered = normalized.filter(a => String(a.artistId) === String(artist.id));
      if (filtered.length > 0) return filtered;
    }
    return MOCK_DATA.artworks.filter(a => String(a.artistId) === String(artist.id));
  }, [rawArtworks, artist.id]);

  const loading = loadingArtist && loadingArtworks;

  if (loading) {
    return (
      <div className="container text-center" style={{ paddingTop: '15vh', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em', fontSize: '11px', textTransform: 'uppercase' }}>
        Loading Artist Profile...
      </div>
    );
  }

  if (!artist) {
    return <div className="container" style={{paddingTop: '4rem'}}>Artist not found</div>;
  }

  return (
    <div className="artist-profile-page container">
      {/* Artist Header */}
      <header className="artist-header">
        <img src={artist.avatar} alt={artist.name} className="artist-profile-avatar" />
        <div className="artist-profile-info">
          <h3 className="font-display">
            {artist.name}
            {artist.isVerified && <ShieldCheck size={24} className="text-accent inline-icon" style={{ marginLeft: '8px' }} />}
          </h3>
          
          <div className="artist-meta text-muted">
            <span className="flex items-center gap-2"><MapPin size={16} /> {artist.location || artist.nationality || 'Global'}</span>
            <span className="flex items-center gap-2"><Calendar size={16} /> Joined {new Date(artist.joined || new Date()).getFullYear()}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
