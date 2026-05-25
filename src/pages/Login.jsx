import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../data/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login({ email, password });
      login({ id: data.id, name: data.name, email: data.email, role: data.role }, data.token);
      
      if (data.role === 'ADMIN') navigate('/admin');
      else if (data.role === 'ARTIST') navigate('/dashboard/artist');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <ShieldAlert size={48} className="text-accent mx-auto mb-4" />
          <h1 className="font-display">Welcome Back</h1>
          <p className="text-muted">Sign in to your account</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(255,50,50,0.1)', color: '#ff6b6b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent: 'center' }}>
            {loading ? <Loader className="spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-muted" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" className="text-accent">Register here</Link>
        </p>
      </div>
    </div>
  );
}
