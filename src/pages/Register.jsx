import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../data/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('BUYER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.register({ name, email, password, role });
      login({ id: data.id, name: data.name, email: data.email, role: data.role }, data.token);
      
      if (data.role === 'ADMIN') navigate('/admin');
      else if (data.role === 'ARTIST') navigate('/dashboard/artist');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh', padding: '4rem 0' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <UserPlus size={48} className="text-accent mx-auto mb-4" />
          <h1 className="font-display">Create Account</h1>
          <p className="text-muted">Join the Galero community</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(255,50,50,0.1)', color: '#ff6b6b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>I am a...</label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            >
              <option value="BUYER">Collector / Buyer</option>
              <option value="ARTIST">Artist</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
            {loading ? <Loader className="spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-muted" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" className="text-accent">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
