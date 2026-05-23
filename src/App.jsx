import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import ArtworkDetail from './pages/ArtworkDetail';

import ArtistProfile from './pages/ArtistProfile';
import ArtistDashboard from './pages/ArtistDashboard';
import Onboard from './pages/Onboard';
import CreateListing from './pages/CreateListing';

// Placeholder components for unbuilt pages
const Collections = () => <div className="container" style={{padding: '4rem 0'}}>Curated Collections Page</div>;
const CollectorDashboard = () => <div className="container" style={{padding: '4rem 0'}}>Collector Dashboard</div>;
const AdminPanel = () => <div className="container" style={{padding: '4rem 0'}}>Admin Panel</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Landing />} />
        <Route path="explore" element={<Explore />} />
        <Route path="artwork/:id" element={<ArtworkDetail />} />
        <Route path="artist/:id" element={<ArtistProfile />} />
        <Route path="collections" element={<Collections />} />
        <Route path="dashboard/artist" element={<ArtistDashboard />} />
        <Route path="dashboard/collector" element={<CollectorDashboard />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="onboard" element={<Onboard />} />
        <Route path="create-listing" element={<CreateListing />} />
      </Route>
    </Routes>
  );
}

export default App;
