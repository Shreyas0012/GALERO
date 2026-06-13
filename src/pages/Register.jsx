import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../data/api';
import Footer from '../components/layout/Footer';
import './Register.css';

function StarField() {
  const starsCount = 45;
  const stars = useMemo(() => {
    return Array.from({ length: starsCount }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: `${Math.random() * 6}s`,
      duration: `${4 + Math.random() * 6}s`
    }));
  }, []);

  return (
    <div className="register-starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className="register-star"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration
          }}
        />
      ))}
    </div>
  );
}

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('BUYER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      setError('You must agree to the Terms of Service and Privacy Policy to create your account.');
      return;
    }
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.97, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="register-page-container">
      {/* Background ambient lighting */}
      <div className="register-glow-1" />

      {/* Floating Shimmering Stars */}
      <StarField />

      {/* Floating Glass Card container shifted to the right */}
      <div className="register-card-wrapper">
        <motion.div 
          className="register-glass-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Form Column */}
          <div className="register-form-side">
            {/* Logo */}
            <div className="register-logo-container">
              <div className="register-logo-dot" />
              <span className="register-logo-text">Galero</span>
            </div>

            <h2 className="register-form-title">Join Galero</h2>
            <p className="register-form-subtitle">Discover and collect provenance-backed digital and physical art.</p>

            {/* Errors */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  className="register-error-banner"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <ShieldAlert size={15} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="register-input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="register-input"
                  placeholder="e.g., Aarav Sharma"
                />
              </div>

              {/* Email */}
              <div className="register-input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="register-input"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="register-input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="register-input"
                  placeholder="Create a password"
                />
              </div>

              {/* Role selection */}
              <div className="register-input-group">
                <label>I want to join as a...</label>
                <div className="register-select-wrapper">
                  <select 
                    value={role} 
                    onChange={e => setRole(e.target.value)}
                    className="register-select"
                  >
                    <option value="BUYER">Collector / Buyer</option>
                    <option value="ARTIST">Artist</option>
                  </select>
                </div>
              </div>

              {/* Agreement checkbox */}
              <div 
                className="register-checkbox-container"
                onClick={() => setAgree(!agree)}
              >
                <input 
                  type="checkbox" 
                  checked={agree}
                  onChange={() => {}} // Controlled by wrapper click
                />
                <span className="register-checkbox-text">
                  I agree to the <strong>Terms of Service & Privacy Policy</strong>
                </span>
              </div>

              {/* Submit */}
              <motion.button 
                type="submit" 
                className="register-btn-submit" 
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {loading ? <Loader className="spin" size={16} /> : 'Create Account'}
              </motion.button>
            </form>

            {/* Social logins */}
            <div className="register-divider">
              <span>or register with</span>
            </div>

            <div className="register-social-row">
              <button className="register-social-btn" onClick={() => alert('OAuth login clicked')}>
                Google
              </button>
              <button className="register-social-btn" onClick={() => alert('OAuth login clicked')}>
                Apple
              </button>
              <button className="register-social-btn" onClick={() => alert('OAuth login clicked')}>
                Twitter
              </button>
            </div>

            {/* Footer redirection */}
            <p className="register-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="register-footer-link">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
