import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import './Onboard.css';

const STEPS = [
  { id: 1, title: 'Profile' },
  { id: 2, title: 'Portfolio' },
  { id: 3, title: 'Identity' }
];

export default function Onboard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="onboard-page container flex items-center justify-center">
        <div className="card onboard-success text-center">
          <div className="success-icon-wrapper">
            <Check size={48} className="text-success" />
          </div>
          <h2 className="font-display">Application Submitted</h2>
          <p className="text-muted">Our curation team will review your portfolio and verify your identity. You will hear back from us within 48 hours.</p>
          <a href="/" className="btn btn-primary" style={{marginTop: 'var(--space-6)'}}>Return Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="onboard-page container">
      <div className="onboard-header text-center">
        <h1 className="font-display">Apply as an Artist</h1>
        <p className="text-muted">Join a curated marketplace of world-class creators.</p>
      </div>

      <div className="onboard-container">
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-steps">
            {STEPS.map((step) => (
              <div 
                key={step.id} 
                className={`step-indicator ${currentStep >= step.id ? 'active' : ''}`}
              >
                <div className="step-number">{step.id}</div>
                <span className="step-title">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="progress-bar-bg">
            <motion.div 
              className="progress-bar-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Area */}
        <div className="form-container card">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <div className="form-step">
                  <h3 className="font-display">Artist Profile</h3>
                  <div className="input-group">
                    <label>Full Name or Moniker</label>
                    <input type="text" placeholder="e.g. Elena Rostova" />
                  </div>
                  <div className="input-group">
                    <label>Location</label>
                    <input type="text" placeholder="City, Country" />
                  </div>
                  <div className="input-group">
                    <label>Artist Bio</label>
                    <textarea rows="4" placeholder="Tell us about your practice..."></textarea>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="form-step">
                  <h3 className="font-display">Portfolio Verification</h3>
                  <p className="text-muted" style={{fontSize: '0.875rem', marginBottom: 'var(--space-4)'}}>
                    Link your existing portfolio or social profiles to help establish your provenance.
                  </p>
                  <div className="input-group">
                    <label>Personal Website / Portfolio</label>
                    <input type="url" placeholder="https://" />
                  </div>
                  <div className="input-group">
                    <label>Instagram Handle</label>
                    <input type="text" placeholder="@" />
                  </div>
                  <div className="input-group">
                    <label>Twitter / X Handle</label>
                    <input type="text" placeholder="@" />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="form-step">
                  <h3 className="font-display">Identity & Wallet</h3>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="hello@example.com" />
                  </div>
                  <div className="input-group">
                    <label>Ethereum Wallet Address (Optional)</label>
                    <input type="text" placeholder="0x..." />
                    <p className="help-text">You can connect this later. We use this to establish on-chain provenance for your works.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="form-actions">
            {currentStep > 1 ? (
              <button className="btn btn-outline" onClick={prevStep} disabled={isSubmitting}>
                Back
              </button>
            ) : <div></div>}
            
            {currentStep < STEPS.length ? (
              <button className="btn btn-primary" onClick={nextStep}>
                Continue
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
