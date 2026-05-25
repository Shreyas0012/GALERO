import { useState } from 'react';
import {
  ShieldAlert, Users, Image as ImageIcon, Plus,
  Pencil, Trash2, X, Check, Loader, Palette
} from 'lucide-react';
import { artworksApi, artistsApi, uploadApi, normalizeArtwork, normalizeArtist } from '../data/api';
import { useFetch } from '../hooks/useFetch';
import './AdminPanel.css';

// ─── Reusable Modal ───────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button className="admin-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}

// ─── Artwork Form ─────────────────────────────────────────
function ArtworkForm({ initial = {}, artists = [], onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    price: initial.price || '',
    category: initial.category || '',
    medium: initial.medium || '',
    year: initial.year || new Date().getFullYear(),
    imageUrl: initial.imageUrl || '',
    isAvailable: initial.isAvailable !== false,
    artistId: initial.artist?.id || '',
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if we have a file to upload
    const fileInput = document.getElementById('adminArtworkImageFile');
    let finalImageUrl = form.imageUrl;
    
    if (fileInput && fileInput.files.length > 0) {
      // Need to upload the file first
      // Note: we can't do await here easily if the parent handles submit, 
      // but let's change onSubmit to be async or just let parent handle it.
      // For simplicity, we'll let parent handle the upload if we pass the file.
      onSubmit({
        ...form,
        price: parseFloat(form.price) || null,
        year: parseInt(form.year) || null,
        artist: form.artistId ? { id: parseInt(form.artistId) } : null,
        imageFile: fileInput.files[0]
      });
      return;
    }

    onSubmit({
      ...form,
      price: parseFloat(form.price) || null,
      year: parseInt(form.year) || null,
      artist: form.artistId ? { id: parseInt(form.artistId) } : null,
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <div className="admin-form-group">
          <label>Title *</label>
          <input required value={form.title} onChange={set('title')} placeholder="Artwork title" />
        </div>
        <div className="admin-form-group">
          <label>Category</label>
          <input value={form.category} onChange={set('category')} placeholder="Abstract, Portrait..." />
        </div>
        <div className="admin-form-group">
          <label>Medium</label>
          <input value={form.medium} onChange={set('medium')} placeholder="Oil on Canvas, Digital..." />
        </div>
        <div className="admin-form-group">
          <label>Price (USD)</label>
          <input type="number" value={form.price} onChange={set('price')} placeholder="0.00" min="0" step="0.01" />
        </div>
        <div className="admin-form-group">
          <label>Year</label>
          <input type="number" value={form.year} onChange={set('year')} min="1900" max="2100" />
        </div>
        <div className="admin-form-group">
          <label>Artist</label>
          <select value={form.artistId} onChange={set('artistId')}>
            <option value="">— No artist —</option>
            {artists.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div className="admin-form-group admin-form-full">
          <label>Upload Image</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
            <input type="file" id="adminArtworkImageFile" accept="image/*" />
          </div>
          <label style={{marginTop: '0.5rem'}}>Or Image URL</label>
          <input value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." />
        </div>
        <div className="admin-form-group admin-form-full">
          <label>Description</label>
          <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Artwork description..." />
        </div>
        <div className="admin-form-group">
          <label className="admin-checkbox-label">
            <input type="checkbox" checked={form.isAvailable}
              onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))} />
            Available for purchase
          </label>
        </div>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn-admin-cancel" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-admin-submit" disabled={loading}>
          {loading ? <Loader size={14} className="spin" /> : <Check size={14} />}
          {initial.id ? 'Update Artwork' : 'Create Artwork'}
        </button>
      </div>
    </form>
  );
}

// ─── Artist Form ──────────────────────────────────────────
function ArtistForm({ initial = {}, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    bio: initial.bio || '',
    nationality: initial.nationality || '',
    birthYear: initial.birthYear || '',
    profileImage: initial.profileImage || '',
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, birthYear: parseInt(form.birthYear) || null });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <div className="admin-form-group">
          <label>Name *</label>
          <input required value={form.name} onChange={set('name')} placeholder="Artist name" />
        </div>
        <div className="admin-form-group">
          <label>Nationality</label>
          <input value={form.nationality} onChange={set('nationality')} placeholder="Indian, French..." />
        </div>
        <div className="admin-form-group">
          <label>Birth Year</label>
          <input type="number" value={form.birthYear} onChange={set('birthYear')} min="1900" max="2099" />
        </div>
        <div className="admin-form-group admin-form-full">
          <label>Profile Image URL</label>
          <input value={form.profileImage} onChange={set('profileImage')} placeholder="https://..." />
        </div>
        <div className="admin-form-group admin-form-full">
          <label>Bio</label>
          <textarea value={form.bio} onChange={set('bio')} rows={3} placeholder="Artist biography..." />
        </div>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn-admin-cancel" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-admin-submit" disabled={loading}>
          {loading ? <Loader size={14} className="spin" /> : <Check size={14} />}
          {initial.id ? 'Update Artist' : 'Create Artist'}
        </button>
      </div>
    </form>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('artworks');
  const [modal, setModal] = useState(null); // { type: 'artwork'|'artist', data?: item }
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch data
  const { data: rawArtworks, loading: loadingArt, error: errArt, } = useFetch(artworksApi.getAll);
  const { data: rawArtists, loading: loadingArtists, error: errArtists } = useFetch(artistsApi.getAll);

  const artworks = (rawArtworks || []).map(normalizeArtwork);
  const artists = (rawArtists || []).map(normalizeArtist);

  // ── Artwork CRUD ──
  const handleCreateArtwork = async (data) => {
    setSubmitting(true);
    try {
      let finalImageUrl = data.imageUrl;
      if (data.imageFile) {
        const uploadRes = await uploadApi.uploadImage(data.imageFile);
        finalImageUrl = uploadRes.url;
      }
      
      const payload = { ...data };
      delete payload.imageFile;
      payload.imageUrl = finalImageUrl;

      await artworksApi.create(payload);
      setModal(null);
      window.location.reload();
    } catch (e) { alert('Failed to create artwork') }
    finally { setSubmitting(false); }
  };

  const handleUpdateArtwork = async (data) => {
    setSubmitting(true);
    try {
      let finalImageUrl = data.imageUrl;
      if (data.imageFile) {
        const uploadRes = await uploadApi.uploadImage(data.imageFile);
        finalImageUrl = uploadRes.url;
      }
      
      const payload = { ...data };
      delete payload.imageFile;
      payload.imageUrl = finalImageUrl;

      await artworksApi.update(modal.data.id, payload);
      setModal(null);
      window.location.reload();
    } catch (e) { alert('Failed to update artwork') }
    finally { setSubmitting(false); }
  };

  const handleDeleteArtwork = async (id) => {
    setSubmitting(true);
    try {
      await artworksApi.delete(id);
      setDeleteConfirm(null);
      window.location.reload();
    } catch (e) { alert('Failed to delete artwork') }
    finally { setSubmitting(false); }
  };

  // ── Artist CRUD ──
  const handleCreateArtist = async (data) => {
    setSubmitting(true);
    try {
      await artistsApi.create(data);
      setModal(null);
      window.location.reload();
    } catch (e) { alert('Failed to create artist') }
    finally { setSubmitting(false); }
  };

  const handleUpdateArtist = async (data) => {
    setSubmitting(true);
    try {
      await artistsApi.update(modal.data.id, data);
      setModal(null);
      window.location.reload();
    } catch (e) { alert('Failed to update artist') }
    finally { setSubmitting(false); }
  };

  const handleDeleteArtist = async (id) => {
    setSubmitting(true);
    try {
      await artistsApi.delete(id);
      setDeleteConfirm(null);
      window.location.reload();
    } catch (e) { alert('Failed to delete artist') }
    finally { setSubmitting(false); }
  };

  return (
    <div className="admin-page container">
      <header className="admin-header">
        <div>
          <h1 className="font-display flex items-center gap-2">
            <ShieldAlert size={28} className="text-accent" />
            Curator Command Center
          </h1>
          <p className="text-muted">Manage artworks, artists, and collections.</p>
        </div>
      </header>

      {/* Stats */}
      <div className="dashboard-stats grid md:grid-cols-3 gap-4">
        <div className="card stat-card">
          <div className="stat-card-icon"><ImageIcon size={20} /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Total Artworks</span>
            <span className="stat-card-value">{artworks.length}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon"><Users size={20} /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Total Artists</span>
            <span className="stat-card-value">{artists.length}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon"><Palette size={20} /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Available Works</span>
            <span className="stat-card-value">
              {artworks.filter(a => a.status === 'active').length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'artworks' ? 'active' : ''}`}
          onClick={() => setActiveTab('artworks')}
        >
          <ImageIcon size={15} /> Artworks
        </button>
        <button
          className={`admin-tab ${activeTab === 'artists' ? 'active' : ''}`}
          onClick={() => setActiveTab('artists')}
        >
          <Users size={15} /> Artists
        </button>
      </div>

      {/* ── Artworks Tab ── */}
      {activeTab === 'artworks' && (
        <section className="admin-section">
          <div className="section-header">
            <h2 className="font-display">Artworks</h2>
            <button className="btn-admin-add" onClick={() => setModal({ type: 'artwork' })}>
              <Plus size={15} /> Add Artwork
            </button>
          </div>

          {loadingArt ? (
            <div className="admin-loading">Loading artworks...</div>
          ) : errArt ? (
            <div className="admin-error">Failed to load artworks</div>
          ) : (
            <div className="listings-table-container card">
              <table className="listings-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artworks.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)' }}>No artworks yet</td></tr>
                  ) : artworks.map(artwork => (
                    <tr key={artwork.id}>
                      <td>
                        <img
                          src={artwork.images[0]}
                          alt={artwork.title}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }}
                        />
                      </td>
                      <td><strong>{artwork.title}</strong></td>
                      <td>{artwork.artist?.name || '—'}</td>
                      <td>{artwork.editionType || '—'}</td>
                      <td>{artwork.price}</td>
                      <td>
                        <span className={`badge ${artwork.status === 'active' ? 'badge-accent' : ''}`}>
                          {artwork.status === 'active' ? 'Available' : 'Sold'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn-icon-edit"
                            onClick={() => setModal({ type: 'artwork', data: rawArtworks.find(a => String(a.id) === artwork.id) })}
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="btn-icon-delete"
                            onClick={() => setDeleteConfirm({ type: 'artwork', id: artwork.id, name: artwork.title })}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ── Artists Tab ── */}
      {activeTab === 'artists' && (
        <section className="admin-section">
          <div className="section-header">
            <h2 className="font-display">Artists</h2>
            <button className="btn-admin-add" onClick={() => setModal({ type: 'artist' })}>
              <Plus size={15} /> Add Artist
            </button>
          </div>

          {loadingArtists ? (
            <div className="admin-loading">Loading artists...</div>
          ) : errArtists ? (
            <div className="admin-error">Failed to load artists</div>
          ) : (
            <div className="listings-table-container card">
              <table className="listings-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Nationality</th>
                    <th>Birth Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artists.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)' }}>No artists yet</td></tr>
                  ) : artists.map(artist => (
                    <tr key={artist.id}>
                      <td>
                        <img
                          src={artist.avatar}
                          alt={artist.name}
                          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }}
                        />
                      </td>
                      <td><strong>{artist.name}</strong></td>
                      <td>{artist.nationality || '—'}</td>
                      <td>{artist.birthYear || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn-icon-edit"
                            onClick={() => setModal({ type: 'artist', data: rawArtists.find(a => String(a.id) === artist.id) })}
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="btn-icon-delete"
                            onClick={() => setDeleteConfirm({ type: 'artist', id: artist.id, name: artist.name })}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ── Create / Edit Modal ── */}
      {modal && (
        <Modal
          title={
            modal.type === 'artwork'
              ? (modal.data ? 'Edit Artwork' : 'Add New Artwork')
              : (modal.data ? 'Edit Artist' : 'Add New Artist')
          }
          onClose={() => setModal(null)}
        >
          {modal.type === 'artwork' ? (
            <ArtworkForm
              initial={modal.data || {}}
              artists={rawArtists || []}
              onSubmit={modal.data ? handleUpdateArtwork : handleCreateArtwork}
              onClose={() => setModal(null)}
              loading={submitting}
            />
          ) : (
            <ArtistForm
              initial={modal.data || {}}
              onSubmit={modal.data ? handleUpdateArtist : handleCreateArtist}
              onClose={() => setModal(null)}
              loading={submitting}
            />
          )}
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
              Are you sure you want to delete <strong style={{ color: '#fff' }}>{deleteConfirm.name}</strong>?<br />
              <span style={{ fontSize: '12px', color: 'rgba(255,100,100,0.7)' }}>This cannot be undone.</span>
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-admin-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button
                className="btn-admin-delete"
                disabled={submitting}
                onClick={() =>
                  deleteConfirm.type === 'artwork'
                    ? handleDeleteArtwork(deleteConfirm.id)
                    : handleDeleteArtist(deleteConfirm.id)
                }
              >
                {submitting ? <Loader size={14} className="spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
