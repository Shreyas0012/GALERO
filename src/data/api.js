import { MOCK_DATA } from './mock';

// Central API service — all backend calls go through here
const hostname = window.location.hostname;
const BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${hostname}:8080/api`;

// ─── Helper: handle fetch response ──────────────────────
async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    console.error(`API Error: ${response.status} ${response.statusText}`, text);
    throw new Error(text || response.statusText);
  }
  if (response.status === 204) return null;
  return response.json();
}

// ─── Helper: get headers with auth ──────────────────────
function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// ─── Artworks ───────────────────────────────────────────
export const artworksApi = {
  getAll: () => fetch(`${BASE_URL}/artworks`)
    .then(handleResponse)
    .catch(err => {
      console.warn("API error (getAll), falling back to mock data:", err);
      return MOCK_DATA.artworks;
    }),
  getById: (id) => fetch(`${BASE_URL}/artworks/${id}`)
    .then(handleResponse)
    .catch(err => {
      console.warn(`API error (getById ${id}), falling back to mock data:`, err);
      return MOCK_DATA.artworks.find(a => String(a.id) === String(id));
    }),
  getByCategory: (category) => fetch(`${BASE_URL}/artworks/category/${category}`)
    .then(handleResponse)
    .catch(err => {
      console.warn(`API error (getByCategory ${category}), falling back to mock data:`, err);
      return MOCK_DATA.artworks.filter(a => a.category === category || a.editionType === category);
    }),
  create: (data) => fetch(`${BASE_URL}/artworks`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
  }).then(handleResponse),
  update: (id, data) => fetch(`${BASE_URL}/artworks/${id}`, {
    method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
  }).then(handleResponse),
  delete: (id) => fetch(`${BASE_URL}/artworks/${id}`, {
    method: 'DELETE', headers: getHeaders()
  }).then(handleResponse),
};

// ─── Artists ────────────────────────────────────────────
export const artistsApi = {
  getAll: () => fetch(`${BASE_URL}/artists`)
    .then(handleResponse)
    .catch(err => {
      console.warn("API error (getAll artists), falling back to mock data:", err);
      return MOCK_DATA.artists;
    }),
  getById: (id) => fetch(`${BASE_URL}/artists/${id}`)
    .then(handleResponse)
    .catch(err => {
      console.warn(`API error (getById artist ${id}), falling back to mock data:`, err);
      return MOCK_DATA.artists.find(a => String(a.id) === String(id));
    }),
  create: (data) => fetch(`${BASE_URL}/artists`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
  }).then(handleResponse),
  update: (id, data) => fetch(`${BASE_URL}/artists/${id}`, {
    method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
  }).then(handleResponse),
  delete: (id) => fetch(`${BASE_URL}/artists/${id}`, {
    method: 'DELETE', headers: getHeaders()
  }).then(handleResponse),
};

// ─── Auth ───────────────────────────────────────────────
export const authApi = {
  login: (data) => fetch(`${BASE_URL}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  }).then(handleResponse),
  register: (data) => fetch(`${BASE_URL}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  }).then(handleResponse)
};
// ─── Upload ───────────────────────────────────────────────
export const uploadApi = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData, // Do NOT set Content-Type, browser will set it with boundary
    });
    
    return handleResponse(response);
  }
};
// ─── Collections ────────────────────────────────────────
export const collectionsApi = {
  getAll: () => fetch(`${BASE_URL}/collections`)
    .then(handleResponse)
    .catch(err => {
      console.warn("API error (getAll collections), falling back to mock data:", err);
      return MOCK_DATA.collections;
    }),
  getById: (id) => fetch(`${BASE_URL}/collections/${id}`)
    .then(handleResponse)
    .catch(err => {
      console.warn(`API error (getById collection ${id}), falling back to mock data:`, err);
      return MOCK_DATA.collections.find(c => String(c.id) === String(id));
    }),
  create: (collection) => fetch(`${BASE_URL}/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(collection),
  }).then(handleResponse),
  delete: (id) => fetch(`${BASE_URL}/collections/${id}`, { method: 'DELETE' }).then(handleResponse),
};

// ─── Helper: normalize backend artwork → UI format ──────
export function normalizeArtwork(artwork) {
  if (!artwork) return null;
  const artistIdStr = artwork.artistId || (artwork.artist ? String(artwork.artist.id) : null);
  const foundArtist = artwork.artist || (artistIdStr ? MOCK_DATA.artists.find(a => String(a.id) === String(artistIdStr)) : null);

  return {
    id: String(artwork.id),
    title: artwork.title || 'Untitled',
    artistId: artistIdStr,
    artist: foundArtist ? normalizeArtist(foundArtist) : null,
    medium: artwork.medium || '',
    editionType: artwork.category || artwork.editionType || 'Original',
    price: artwork.price ? (String(artwork.price).includes('USD') || String(artwork.price).includes('ETH') ? String(artwork.price) : `${artwork.price} USD`) : 'Price on Request',
    status: artwork.isAvailable !== undefined ? (artwork.isAvailable ? 'active' : 'sold') : (artwork.status || 'active'),
    orientation: artwork.orientation || 'portrait',
    images: artwork.imageUrl ? [artwork.imageUrl] : (artwork.images && artwork.images.length > 0 ? artwork.images : ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800']),
    dimensions: artwork.dimensions || '',
    year: artwork.year ? String(artwork.year) : '',
    description: artwork.description || '',
    provenance: artwork.provenance || [],
  };
}

// ─── Helper: normalize backend artist → UI format ───────
export function normalizeArtist(artist) {
  if (!artist) return null;
  return {
    id: String(artist.id),
    name: artist.name || 'Unknown Artist',
    avatar: artist.profileImage || artist.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    bio: artist.bio || '',
    isVerified: artist.isVerified !== undefined ? artist.isVerified : true,
    nationality: artist.nationality || '',
    birthYear: artist.birthYear || null,
  };
}
