import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, Loader } from 'lucide-react';
import './CreateListing.css';

const STEPS = [
  { id: 1, title: 'Upload' },
  { id: 2, title: 'Details' },
  { id: 3, title: 'Model' },
  { id: 4, title: 'Publish' }
];

export default function CreateListing() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '', medium: '', editionType: 'Digital', price: ''
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handlePublish = () => {
    setIsMinting(true);
    // Simulate transaction delay
    setTimeout(() => {
      setIsMinting(false);
      setIsSuccess(true);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="create-listing-page container flex items-center justify-center">
        <div className="card onboard-success text-center">
          <div className="success-icon-wrapper">
            <Check size={48} className="text-success" />
          </div>
          <h2 className="font-display">Artwork Published</h2>
          <p className="text-muted">Your artwork "{formData.title || 'Untitled'}" is now live on Galero. Its digital provenance has been successfully registered.</p>
          <div className="flex gap-4 justify-center" style={{ marginTop: 'var(--space-6)' }}>
            <a href="/dashboard/artist" className="btn btn-outline">Dashboard</a>
            <a href="/explore" className="btn btn-primary">View Listing</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-listing-page container">
      <div className="onboard-header text-center">
        <h3 className="font-display">Create New Listing</h3>
        <p className="text-muted">Register and list a new artwork on the marketplace.</p>
      </div>

      <div className="onboard-container">
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-steps">
            {STEPS.map((step) => (
              <div key={step.id} className={`step-indicator ${currentStep >= step.id ? 'active' : ''}`}>
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
                <div className="form-step text-center">
                  <h3 className="font-display">Upload Artwork</h3>
                  <div className="upload-dropzone">
                    <Upload size={48} className="text-muted mb-4" />
                    <p>Drag and drop a high-resolution image</p>
                    <p className="help-text">JPG, PNG, GIF, max 50MB</p>
                    <button className="btn btn-outline" style={{ marginTop: 'var(--space-4)' }}>Browse Files</button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="form-step">
                  <h3 className="font-display">Artwork Details</h3>
                  <div className="input-group">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Ephemeral Silence"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>Medium</label>
                    <input
                      type="text"
                      placeholder="e.g. Oil on Canvas"
                      value={formData.medium}
                      onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>Description</label>
                    <textarea rows="4" placeholder="Tell the story behind this piece..."></textarea>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="form-step">
                  <h3 className="font-display">Listing Model</h3>

                  <div className="listing-models grid gap-4">
                    {['Digital', 'Physical', 'Phygital'].map(type => (
                      <label key={type} className={`model-card card ${formData.editionType === type ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="editionType"
                          value={type}
                          checked={formData.editionType === type}
                          onChange={(e) => setFormData({ ...formData, editionType: e.target.value })}
                          className="sr-only"
                        />
                        <div className="model-info">
                          <h4>{type} {type === 'Phygital' && <span className="badge badge-accent">Recommended</span>}</h4>
                          <p className="text-muted text-sm">
                            {type === 'Digital' && 'A purely digital artwork represented as an NFT.'}
                            {type === 'Physical' && 'A physical artwork with a digital certificate of authenticity.'}
                            {type === 'Phygital' && 'A digital NFT bundled with the original physical artwork.'}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="input-group" style={{ marginTop: 'var(--space-6)' }}>
                    <label>Price (ETH)</label>
                    <input
                      type="text"
                      placeholder="e.g. 1.5"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="form-step">
                  <h3 className="font-display">Review & Publish</h3>

                  <div className="review-panel card">
                    <div className="review-row">
                      <span className="text-muted">Title</span>
                      <span>{formData.title || 'Untitled'}</span>
                    </div>
                    <div className="review-row">
                      <span className="text-muted">Type</span>
                      <span>{formData.editionType}</span>
                    </div>
                    <div className="review-row">
                      <span className="text-muted">Price</span>
                      <span>{formData.price ? `${formData.price} ETH` : 'Not set'}</span>
                    </div>
                  </div>

                  {isMinting && (
                    <div className="minting-status flex flex-col items-center gap-4">
                      <Loader size={32} className="spin text-accent" />
                      <p>Registering provenance and creating listing...</p>
                      <p className="text-muted text-sm">Please do not close this window.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="form-actions">
            {currentStep > 1 && !isMinting ? (
              <button className="btn btn-outline" onClick={prevStep}>
                Back
              </button>
            ) : <div></div>}

            {currentStep < STEPS.length ? (
              <button className="btn btn-primary" onClick={nextStep}>
                Continue
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handlePublish} disabled={isMinting}>
                {isMinting ? 'Publishing...' : 'Confirm & Publish'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
