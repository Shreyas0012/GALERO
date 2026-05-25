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
  getAll: () => fetch(`${BASE_URL}/artworks`).then(handleResponse),
  getById: (id) => fetch(`${BASE_URL}/artworks/${id}`).then(handleResponse),
  getByCategory: (category) => fetch(`${BASE_URL}/artworks/category/${category}`).then(handleResponse),
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
  getAll: () => fetch(`${BASE_URL}/artists`).then(handleResponse),
  getById: (id) => fetch(`${BASE_URL}/artists/${id}`).then(handleResponse),
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
  getAll: () => fetch(`${BASE_URL}/collections`).then(handleResponse),
  getById: (id) => fetch(`${BASE_URL}/collections/${id}`).then(handleResponse),
  create: (collection) => fetch(`${BASE_URL}/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(collection),
  }).then(handleResponse),
  delete: (id) => fetch(`${BASE_URL}/collections/${id}`, { method: 'DELETE' }).then(handleResponse),
};

// ─── Helper: normalize backend artwork → UI format ──────
export function normalizeArtwork(artwork) {
  return {
    id: String(artwork.id),
    title: artwork.title || 'Untitled',
    artistId: artwork.artist ? String(artwork.artist.id) : null,
    artist: artwork.artist ? normalizeArtist(artwork.artist) : null,
    medium: artwork.medium || '',
    editionType: artwork.category || 'Original',
    price: artwork.price ? `${artwork.price} USD` : 'Price on Request',
    status: artwork.isAvailable ? 'active' : 'sold',
    orientation: 'portrait', // default — add orientation field to DB later
    images: artwork.imageUrl ? [artwork.imageUrl] : ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800'],
    dimensions: '',
    year: artwork.year ? String(artwork.year) : '',
    description: artwork.description || '',
    provenance: [],
  };
}

// ─── Helper: normalize backend artist → UI format ───────
export function normalizeArtist(artist) {
  return {
    id: String(artist.id),
    name: artist.name || 'Unknown Artist',
    avatar: artist.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    bio: artist.bio || '',
    isVerified: true,
    nationality: artist.nationality || '',
    birthYear: artist.birthYear || null,
  };
}
