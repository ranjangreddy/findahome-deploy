import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Upload, Home, MapPin, DollarSign, Calendar } from 'lucide-react';
import styles from './PostProperty.module.css';

type Step = 'details' | 'amenities' | 'photos' | 'pricing';

interface PropertyForm {
  title: string;
  type: string;
  location: string;
  description: string;
  amenities: string[];
  photoUrls: string[];
  price: string;
  availableFrom: string;
  availableTo: string;
}

function PostProperty() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [progress, setProgress] = useState(25);
  const [form, setForm] = useState<PropertyForm>({
    title: '',
    type: '',
    location: '',
    description: '',
    amenities: [],
    photoUrls: [],
    price: '',
    availableFrom: '',
    availableTo: '',
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const urls = newFiles.map(file => URL.createObjectURL(file));
      setForm(prev => ({
        ...prev,
        photoUrls: [...prev.photoUrls, ...urls].slice(0, 4)
      }));
    }
  }, []);

  const removePhoto = useCallback((index: number) => {
    setForm(prev => ({
      ...prev,
      photoUrls: prev.photoUrls.filter((_, i) => i !== index)
    }));
  }, []);

  const handleAmenityToggle = useCallback((amenity: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  }, []);

  const handleNext = useCallback(() => {
    const steps: Step[] = ['details', 'amenities', 'photos', 'pricing'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      setProgress((currentIndex + 2) * 25);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(() => {
    localStorage.setItem('propertyData', JSON.stringify(form));
    navigate('/preview-listing');
  }, [form, navigate]);

  const renderStep = () => {
    switch (currentStep) {
      case 'details':
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Property Details</h2>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Home className={styles.inputIcon} />
                Property Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                className={styles.input}
                placeholder="Enter property title"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Home className={styles.inputIcon} />
                Property Type
              </label>
              <select
                value={form.type}
                onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                className={styles.input}
              >
                <option value="">Select type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <MapPin className={styles.inputIcon} />
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                className={styles.input}
                placeholder="Enter location"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                className={styles.textarea}
                placeholder="Describe your property"
              />
            </div>
          </div>
        );

      case 'amenities':
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Property Amenities</h2>
            <div className={styles.amenitiesGrid}>
              {['WiFi', 'Free Parking', 'Hot Water', 'In-House Laundry', 'AC', 'Electricity', 'Gas', 'Swimming Pool', 'Gym', 'Security'].map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className={form.amenities.includes(amenity) ? styles.amenityButtonActive : styles.amenityButton}
                  type="button"
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        );

      case 'photos':
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Property Photos</h2>
            <div className={styles.photosGrid}>
              {Array(4).fill(null).map((_, index) => (
                <div key={index} className={styles.photoUploadContainer}>
                  {form.photoUrls[index] ? (
                    <div className={styles.photoPreview}>
                      <img src={form.photoUrls[index]} alt={`Property ${index + 1}`} />
                      <button
                        onClick={() => removePhoto(index)}
                        className={styles.removeButton}
                        type="button"
                      >
                        <X />
                      </button>
                    </div>
                  ) : (
                    <label className={styles.photoUpload}>
                      <Upload className={styles.uploadIcon} />
                      <span className={styles.uploadText}>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.fileInput}
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Pricing & Availability</h2>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <DollarSign className={styles.inputIcon} />
                Price (per day)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                className={styles.input}
                placeholder="0.00"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Calendar className={styles.inputIcon} />
                Available From
              </label>
              <input
                type="date"
                value={form.availableFrom}
                onChange={e => setForm(prev => ({ ...prev, availableFrom: e.target.value }))}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Calendar className={styles.inputIcon} />
                Available To
              </label>
              <input
                type="date"
                value={form.availableTo}
                onChange={e => setForm(prev => ({ ...prev, availableTo: e.target.value }))}
                className={styles.input}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        {renderStep()}

        <div className={styles.actionButtons}>
          {currentStep === 'pricing' ? (
            <button
              onClick={handleSubmit}
              className={styles.submitButton}
              type="button"
            >
              Preview Listing
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={styles.nextButton}
              type="button"
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostProperty;
