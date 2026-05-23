import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ArtworkCard from '../components/domain/ArtworkCard';
import { MOCK_DATA } from '../data/mock';
import './Explore.css';

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredArtworks = MOCK_DATA.artworks.filter(artwork => 
    artwork.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="explore-page container">
      <header className="explore-header">
        <h1 className="font-display">Explore</h1>
        <p className="text-muted">Discover provenance-backed artworks from verified creators.</p>
      </header>

      <div className="explore-controls">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search artworks, artists, or collections..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline filter-btn">
          <SlidersHorizontal size={20} />
          Filters
        </button>
      </div>

      <div className="explore-layout">
        {/* We can add a sidebar filter here for desktop later */}
        <div className="explore-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.length > 0 ? (
            filteredArtworks.map(artwork => {
              const artist = MOCK_DATA.artists.find(a => a.id === artwork.artistId);
              return <ArtworkCard key={artwork.id} artwork={{ ...artwork, artist }} />;
            })
          ) : (
            <div className="empty-state">
              <h3>No artworks found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
