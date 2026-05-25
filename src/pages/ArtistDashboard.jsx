import { useState, useEffect } from 'react';
import { Plus, Upload, Loader, Image as ImageIcon, Pencil, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { artworksApi, uploadApi, artistsApi } from '../data/api';
import './AdminPanel.css'; // Reuse styles

export default function ArtistDashboard() {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [artistProfile, setArtistProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [modal, setModal] = useState(null); // 'artwork' | 'profile' | null
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      // For a real app, you'd fetch only the artist's artworks from a specific endpoint.
      // Here we filter the global list for demonstration, or assume the backend filters if we used a dedicated endpoint.
      const allArts = await artworksApi.getAll();
      setArtworks(allArts.filter(a => a.artist?.id === user.id || a.artist?.name === user.name));
      
      const allArtists = await artistsApi.getAll();
      const profile = allArtists.find(a => a.name === user.name);
      if (profile) setArtistProfile(profile);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArtwork = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.target);
      
      // 1. Upload image if selected
      const file = formData.get('imageFile');
      let imageUrl = formData.get('imageUrl'); // fallback if they pasted a URL
      
      if (file && file.size > 0) {
        const uploadRes = await uploadApi.uploadImage(file);
        imageUrl = uploadRes.url;
      }

      // 2. Save artwork
      const artworkData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')) || null,
        category: formData.get('category'),
        medium: formData.get('medium'),
        year: parseInt(formData.get('year')) || new Date().getFullYear(),
        imageUrl: imageUrl,
        isAvailable: formData.get('isAvailable') === 'on',
        artist: artistProfile ? { id: artistProfile.id } : null
      };

      await artworksApi.create(artworkData);
      setModal(null);
      loadData();
    } catch (e) {
      alert('Failed to upload artwork');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}><Loader className="spin" /></div>;

  return (
    <div className="admin-page container">
      <header className="admin-header">
        <div>
          <h1 className="font-display">Artist Dashboard</h1>
          <p className="text-muted">Welcome back, {user.name}. Manage your portfolio below.</p>
        </div>
      </header>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="font-display flex items-center gap-2">
            <ImageIcon size={20} className="text-accent" /> My Artworks
          </h2>
          <button className="btn-admin-add" onClick={() => setModal('artwork')}>
            <Plus size={15} /> Upload Artwork
          </button>
        </div>

        <div className="listings-table-container card">
          <table className="listings-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {artworks.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>You haven't uploaded any artworks yet.</td></tr>
              ) : artworks.map(art => (
                <tr key={art.id}>
                  <td>
                    <img src={art.imageUrl} alt={art.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                  </td>
                  <td><strong>{art.title}</strong></td>
                  <td>{art.category || '—'}</td>
                  <td>{art.price ? `$${art.price}` : '—'}</td>
                  <td>
                    <span className={`badge ${art.isAvailable ? 'badge-accent' : ''}`}>
                      {art.isAvailable ? 'Available' : 'Sold'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modal === 'artwork' && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Upload New Artwork</h3>
              <button className="admin-modal-close" onClick={() => setModal(null)}><X size={18} /></button>
            </div>
            <div className="admin-modal-body">
              <form className="admin-form" onSubmit={handleCreateArtwork}>
                <div className="admin-form-grid">
                  <div className="admin-form-group admin-form-full">
                    <label>Upload Image</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                      <Upload size={24} className="text-muted" />
                      <input type="file" name="imageFile" accept="image/*" />
                    </div>
                    <label style={{marginTop: '0.5rem'}}>Or Image URL</label>
                    <input name="imageUrl" placeholder="https://..." />
                  </div>
                  <div className="admin-form-group">
                    <label>Title *</label>
                    <input name="title" required placeholder="Artwork title" />
                  </div>
                  <div className="admin-form-group">
                    <label>Category</label>
                    <input name="category" placeholder="Abstract, Portrait..." />
                  </div>
                  <div className="admin-form-group">
                    <label>Medium</label>
                    <input name="medium" placeholder="Oil on Canvas..." />
                  </div>
                  <div className="admin-form-group">
                    <label>Price (USD)</label>
                    <input type="number" name="price" placeholder="0.00" min="0" step="0.01" />
                  </div>
                  <div className="admin-form-group admin-form-full">
                    <label>Description</label>
                    <textarea name="description" rows={3} placeholder="Tell the story behind this piece..." />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-checkbox-label">
                      <input type="checkbox" name="isAvailable" defaultChecked />
                      Available for purchase
                    </label>
                  </div>
                </div>
                <div className="admin-form-actions">
                  <button type="button" className="btn-admin-cancel" onClick={() => setModal(null)}>Cancel</button>
                  <button type="submit" className="btn-admin-submit" disabled={submitting}>
                    {submitting ? <Loader size={14} className="spin" /> : <Check size={14} />}
                    Upload Artwork
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
