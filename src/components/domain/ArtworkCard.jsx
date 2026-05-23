import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ArtworkCard.css';

export default function ArtworkCard({ artwork }) {
  const { id, title, medium, price, images, editionType, artist } = artwork;

  return (
    <motion.div 
      className="card artwork-card"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/artwork/${id}`} className="artwork-card-link">
        <div className="artwork-image-container">
          <img src={images[0]} alt={title} className="artwork-image" loading="lazy" />
          <div className="artwork-badges">
            <span className="badge badge-accent">{editionType}</span>
          </div>
        </div>
        <div className="artwork-card-content">
          <div className="artwork-meta">
            <h3 className="artwork-title font-display">{title}</h3>
            {artist && <p className="artwork-artist">{artist.name}</p>}
          </div>
          <div className="artwork-details">
            <span className="artwork-medium text-muted">{medium}</span>
            <span className="artwork-price">{price}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
