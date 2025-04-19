import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Upload, Home, MapPin, DollarSign, Calendar, ArrowLeft, Minus, Mail, Phone } from 'lucide-react';
import styles from './PostProperty.module.css';

type Step = 'details' | 'rental-type' | 'amenities' | 'photos' | 'pricing'| 'contact';

interface UnitConfig {
  type: 'private' | 'shared';
  quantity: number;
}

interface PropertyForm {
  name: string;
  type: string;
  location: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  hasLivingRoom: boolean;
  rentalType: 'entire' | 'units' | '';
  units: UnitConfig[];
  amenities: string[];
  photoUrls: string[];
  contactName: string;
  contactEmail: string;
  showEmail: boolean;
  contactPhone: string;
  showPhone: boolean;
  price: string;
  priceUnit: '/day' | '/month';
  availableFrom: string;
  availableTo: string;
}

function PostProperty() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [progress, setProgress] = useState(16.67);
  const [form, setForm] = useState<PropertyForm>({
    name: '',
    type: '',
    location: '',
    description: '',
    bedrooms: 1,
    bathrooms: 1,
    hasLivingRoom: true,
    rentalType: '',
    units: [],
    amenities: [],
    photoUrls: [],
    contactName: '',
    contactEmail: '',
    showEmail: false,
    contactPhone: '',
    showPhone: false,
    price: '',
    priceUnit: '/day',
    availableFrom: '',
    availableTo: '',
  });

  const handleCounter = (type: 'bedrooms' | 'bathrooms', action: 'increment' | 'decrement') => {
    setForm(prev => {
      const currentValue = prev[type];
      const newValue = action === 'increment' ? currentValue + 1 : 
                      action === 'decrement' && currentValue > 1 ? currentValue - 1 : 
                      currentValue;
      return {
        ...prev,
        [type]: newValue
      };
    });
  };

  const addUnit = () => {
    setForm(prev => ({
      ...prev,
      units: [...prev.units, { type: 'private', quantity: 1 }]
    }));
  };

  const updateUnit = (index: number, field: keyof UnitConfig, value: UnitConfig[keyof UnitConfig]) => {
    setForm(prev => ({
      ...prev,
      units: prev.units.map((unit, i) => 
        i === index ? { ...unit, [field]: value } : unit
      )
    }));
  };

  const removeUnit = (index: number) => {
    setForm(prev => ({
      ...prev,
      units: prev.units.filter((_, i) => i !== index)
    }));
  };

  const validateDetails = () => {
    return form.name && form.type && form.location && form.description;
  };

  const validateRentalType = () => {
    if (form.rentalType === 'entire') return true;
    if (form.rentalType === 'units') return form.units.length > 0;
    return false;
  };

  const validateAmenities = () => {
    return form.amenities.length > 0;
  };

  const validatePhotos = () => {
    return form.photoUrls.length > 0;
  };

  const validateContact = () => {
    return form.contactName && form.contactEmail && form.contactPhone;
  };

  const validatePricing = () => {
    return form.price && form.availableFrom;
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 'details':
        return !validateDetails();
      case 'rental-type':
        return !validateRentalType();
      case 'amenities':
        return !validateAmenities();
      case 'photos':
        return !validatePhotos();
     
      case 'pricing':
        return !validatePricing();
         case 'contact':
        return !validateContact();
      default:
        return false;
    }
  };

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
    const steps: Step[] = ['details', 'rental-type', 'amenities', 'photos','pricing','contact'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      setProgress((currentIndex + 2) * 16.67);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    const steps: Step[] = ['details', 'rental-type', 'amenities', 'photos', 'pricing','contact'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      setProgress(currentIndex * 16.67);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(() => {
    if (!isNextDisabled()) {
      localStorage.setItem('propertyData', JSON.stringify(form));
      navigate('/preview-listing');
    }
  }, [form, navigate]);

  const getDescriptionPlaceholder = () => {
    const examples = [
      "Spacious 3BHK with balcony, 10 min from city center. Perfect for co-op students.",
      "Modern 1BHK with high-speed internet, ideal for remote workers.",
      "Shared apartment with 2 other students. Kitchen, Wi-Fi, laundry included."
    ];
    return examples[Math.floor(Math.random() * examples.length)];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'details':
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Property Details</h2>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Home className={styles.inputIcon} />
                Property Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className={styles.input}
                placeholder="Enter property name"
              />
              {!form.name && <p className={styles.error}>Property name is required</p>}
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
              {!form.type && <p className={styles.error}>Property type is required</p>}
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
              {!form.location && <p className={styles.error}>Location is required</p>}
            </div>

            <div className={styles.roomDetails}>
              <div className={styles.roomCounter}>
                <span className={styles.roomLabel}>Bedrooms</span>
                <div className={styles.counterControls}>
                  <button 
                    className={styles.counterButton}
                    onClick={() => handleCounter('bedrooms', 'decrement')}
                    type="button"
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.counterValue}>{form.bedrooms}</span>
                  <button 
                    className={styles.counterButton}
                    onClick={() => handleCounter('bedrooms', 'increment')}
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.roomCounter}>
                <span className={styles.roomLabel}>Bathrooms</span>
                <div className={styles.counterControls}>
                  <button 
                    className={styles.counterButton}
                    onClick={() => handleCounter('bathrooms', 'decrement')}
                    type="button"
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.counterValue}>{form.bathrooms}</span>
                  <button 
                    className={styles.counterButton}
                    onClick={() => handleCounter('bathrooms', 'increment')}
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.toggleContainer}>
                <span className={styles.roomLabel}>Living Room</span>
                <div 
                  className={`${styles.toggle} ${form.hasLivingRoom ? styles.active : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, hasLivingRoom: !prev.hasLivingRoom }))}
                >
                  <div className={styles.toggleHandle} />
                </div>
              </div>
            </div>

            <div className={styles.note}>
              <span className={styles.requiredStar}>*</span>
              <span className={styles.noteText}>Enter full house details, not just the portion you're renting</span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                className={styles.textarea}
                placeholder={getDescriptionPlaceholder()}
              />
              {!form.description && <p className={styles.error}>Description is required</p>}
            </div>
          </div>
        );

      case 'rental-type':
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>What are you Renting?</h2>
            
            <div className={styles.rentalTypeOptions}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  checked={form.rentalType === 'entire'}
                  onChange={() => setForm(prev => ({ ...prev, rentalType: 'entire', units: [] }))}
                />
                <span className={styles.radioLabel}>Rent the entire house</span>
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  checked={form.rentalType === 'units'}
                  onChange={() => setForm(prev => ({ ...prev, rentalType: 'units' }))}
                />
                <span className={styles.radioLabel}>Rent units</span>
              </label>
            </div>

            {form.rentalType === 'units' && (
              <div className={styles.unitsSection}>
                {form.units.map((unit, index) => (
                  <div key={index} className={styles.unitConfig}>
                    <div className={styles.unitHeader}>
                      <h3>Unit {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeUnit(index)}
                        className={styles.removeUnitButton}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className={styles.unitFields}>
                      <div className={styles.unitField}>
                        <label>Unit Type</label>
                        <select
                          value={unit.type}
                          onChange={(e) => updateUnit(index, 'type', e.target.value as 'private' | 'shared')}
                          className={styles.input}
                        >
                          <option value="private">Private Room</option>
                          <option value="shared">Shared Room</option>
                        </select>
                      </div>

                      <div className={styles.unitField}>
                        <label>How many of this type?</label>
                        <input
                          type="number"
                          min="1"
                          value={unit.quantity}
                          onChange={(e) => updateUnit(index, 'quantity', parseInt(e.target.value) || 1)}
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addUnit}
                  className={styles.addUnitButton}
                >
                  <Plus size={16} />
                  Add Unit
                </button>
              </div>
            )}

            {form.rentalType === 'units' && form.units.length === 0 && (
              <p className={styles.error}>Add at least one unit configuration</p>
            )}
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
            {form.amenities.length === 0 && <p className={styles.error}>Select at least one amenity</p>}
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
            {form.photoUrls.length === 0 && <p className={styles.error}>Upload at least one photo</p>}
          </div>
        );

      case 'contact':
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Mail className={styles.inputIcon} />
                Name
              </label>
              <input
                type="text"
                value={form.contactName}
                onChange={e => setForm(prev => ({ ...prev, contactName: e.target.value }))}
                className={styles.input}
                placeholder="Your full name"
              />
              {!form.contactName && <p className={styles.error}>Name is required</p>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Mail className={styles.inputIcon} />
                Contact Email
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={e => setForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                className={styles.input}
                placeholder="your@email.com"
              />
              {!form.contactEmail && <p className={styles.error}>Email is required</p>}
              
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.showEmail}
                  onChange={e => setForm(prev => ({ ...prev, showEmail: e.target.checked }))}
                  className={styles.checkbox}
                />
                Show email to renters
              </label>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Phone className={styles.inputIcon} />
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={e => setForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                className={styles.input}
                placeholder="+1 (555) 000-0000"
              />
              {!form.contactPhone && <p className={styles.error}>Phone number is required</p>}
              
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.showPhone}
                  onChange={e => setForm(prev => ({ ...prev, showPhone: e.target.checked }))}
                  className={styles.checkbox}
                />
                Show phone number to renters
              </label>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Pricing & Availability</h2>
            
            <div className={styles.pricingContainer}>
              <div className={styles.priceInput}>
                <label className={styles.label}>Price</label>
                <div className={styles.priceInputGroup}>
                  <DollarSign className={styles.currencyIcon} />
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                    className={styles.input}
                    placeholder="1200"
                    min="0"
                  />
                  <select
                    value={form.priceUnit}
                    onChange={e => setForm(prev => ({ ...prev, priceUnit: e.target.value as '/day' | '/month' }))}
                    className={styles.unitSelect}
                  >
                    <option value="/day">/day</option>
                    <option value="/month">/month</option>
                  </select>
                </div>
                {!form.price && <p className={styles.error}>Price is required</p>}
              </div>
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
              {!form.availableFrom && <p className={styles.error}>Start date is required</p>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Calendar className={styles.inputIcon} />
                Available To (Optional)
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
          <button
            onClick={handleBack}
            className={styles.backButton}
            type="button"
            disabled={currentStep === 'details'}
          >
            <ArrowLeft className={styles.buttonIcon} />
            Back
          </button>

          {currentStep === 'contact' ? (
            <button
              onClick={handleSubmit}
              className={styles.submitButton}
              type="button"
              disabled={isNextDisabled()}
            >
              Preview Listing
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={styles.nextButton}
              type="button"
              disabled={isNextDisabled()}
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