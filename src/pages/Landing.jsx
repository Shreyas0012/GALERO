import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ArtworkCard from '../components/domain/ArtworkCard';
import { MOCK_DATA } from '../data/mock';
import './Landing.css';

export default function Landing() {
  const featuredArtwork = MOCK_DATA.artworks[0];
  const featuredArtist = MOCK_DATA.artists.find(a => a.id === featuredArtwork.artistId);
  const displayArtwork = { ...featuredArtwork, artist: featuredArtist };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <motion.h1
              className="hero-title font-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Art, Provenance, and the Physical Form.
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Galero is a curated marketplace where trust meets aesthetics. Collect verified originals, sketchbook editions, and phygital works from world-class creators.
            </motion.p>
            <motion.div
              className="hero-actions flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link to="/explore" className="btn btn-primary">Explore Art</Link>
              <Link to="/onboard" className="btn btn-outline">Apply as Artist</Link>
            </motion.div>
          </div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <img src={featuredArtwork.images[0]} alt="Featured Artwork" className="hero-image" />
            <div className="hero-visual-caption">
              <div>
                <p className="caption-title font-display">{featuredArtwork.title}</p>
                <p className="caption-artist">{featuredArtist?.name}</p>
              </div>
              <Link to={`/artwork/${featuredArtwork.id}`} className="btn btn-outline">View Details</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="font-display">Curated Selection</h2>
            <Link to="/explore" className="text-accent">View all works &rarr;</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_DATA.artworks.map(artwork => {
              const artist = MOCK_DATA.artists.find(a => a.id === artwork.artistId);
              return <ArtworkCard key={artwork.id} artwork={{ ...artwork, artist }} />;
            })}
          </div>
        </div>
      </section>

      {/* Trust Proposition */}
      <section className="trust-section">
        <div className="container trust-container">
          <div className="trust-content">
            <h2 className="font-display">Provenance-Backed Ownership</h2>
            <p>Every artwork on Galero carries an immutable record of its history. Whether digital, physical, or phygital, your collection is authenticated and secured forever.</p>
            <ul className="trust-list">
              <li>Verified Artist Profiles</li>
              <li>Transparent Transaction History</li>
              <li>Integrated Physical Fulfillment</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
