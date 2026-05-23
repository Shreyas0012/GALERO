import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import './Collections.css';

const MOCK_COLLECTIONS = [
  {
    id: 1,
    title: 'Neon Brutalism',
    curator: 'ANTIGRAVITY Curation',
    description: 'A curated selection of works exploring the intersection of raw architectural forms and futuristic neon accents.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    itemCount: 12
  },
  {
    id: 2,
    title: 'The Phygital Renaissance',
    curator: 'Elena Rostova',
    description: 'Bridging the physical canvas with the immutable digital ledger. Works that exist in both realms.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200',
    itemCount: 8
  }
];

export default function Collections() {
  return (
    <div className="collections-page container">
      <header className="page-header text-center">
        <Sparkles size={32} className="text-accent mx-auto mb-4" />
        <h1 className="font-display">Curated Collections</h1>
        <p className="text-muted">Exclusive drops and editorial selections.</p>
      </header>

      <div className="collections-layout">
        {MOCK_COLLECTIONS.map((collection, index) => (
          <motion.div 
            key={collection.id} 
            className="collection-feature card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="collection-visual">
              <img src={collection.image} alt={collection.title} loading="lazy" />
            </div>
            <div className="collection-content">
              <span className="badge badge-accent mb-4">Featured</span>
              <h2 className="font-display">{collection.title}</h2>
              <p className="text-muted text-sm mb-6">Curated by {collection.curator}</p>
              <p className="mb-8">{collection.description}</p>
              
              <div className="flex justify-between items-center mt-auto pt-6 border-t border-color">
                <span className="text-muted">{collection.itemCount} works</span>
                <button className="btn btn-outline flex items-center gap-2">
                  View Collection <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
