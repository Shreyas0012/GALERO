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

            <h2 className="register-form-title">Welcome back</h2>
            <p className="register-form-subtitle">Sign in to your Galero account to continue.</p>

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
              <div className="register-input-group" style={{ marginBottom: '1.5rem' }}>
                <label>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="register-input"
                  placeholder="Enter your password"
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                className="register-btn-submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {loading ? <Loader className="spin" size={16} /> : 'Sign In'}
              </motion.button>
            </form>

            {/* Social logins */}
            <div className="register-divider">
              <span>or sign in with</span>
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
              Don't have an account?{' '}
              <Link to="/register" className="register-footer-link">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
