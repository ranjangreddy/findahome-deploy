import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MapPin, Wifi, Car, Droplet, Home, Wind, Zap, Flame, School as Pool, 
  Dumbbell, Shield, Heart, Mail, Phone, Calendar, DollarSign, Bath, Bed, Sofa, Users, Copy, Check 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useFavorites } from '../App';
import styles from './PropertyDetails.module.css';

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { favorites, toggleFavorite } = useFavorites();
  const propertyId = parseInt(id || '1');

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`http://localhost:3000/api/properties/${propertyId}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
        } else {
          toast.error('Failed to load property details');
        }
      } catch (err) {
        console.error(err);
        toast.error('Server error');
      }
    }
    fetchProperty();
  }, [propertyId]);

  const handleImageDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const copyToClipboard = async (text: string, type: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type === 'email' ? 'Email' : 'Phone number'} copied to clipboard!`);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (!property) {
    return <div className={styles.container}>Loading...</div>;
  }

  const imageUrls = (() => {
    try {
      return property.imageUrls ? JSON.parse(property.imageUrls) : [];
    } catch {
      return [];
    }
  })();

  const amenities = (() => {
    try {
      const parsed = JSON.parse(property.amenities);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageSlider}>
          {imageUrls.length > 0 && (
            <img
              src={imageUrls[currentImageIndex]}
              alt={property.name || 'Property'}
              className={styles.mainImage}
            />
          )}
          <button
            className={`${styles.favoriteButton} ${favorites.has(propertyId) ? styles.active : ''}`}
            onClick={() => toggleFavorite(propertyId)}
          >
            <Heart className={styles.favoriteIcon} />
          </button>
          <div className={styles.sliderNav}>
            {imageUrls.map((_, index) => (
              <div
                key={index}
                className={`${styles.sliderDot} ${index === currentImageIndex ? styles.active : ''}`}
                onClick={() => handleImageDotClick(index)}
              />
            ))}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>{property.name || 'Unnamed Property'}</h1>
              <div className={styles.location}>
                <MapPin size={18} />
                <span>{property.location || 'Unknown Location'}</span>
              </div>
            </div>
            <div className={styles.price}>${property.price || 'N/A'}{property.priceUnit || ''}</div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Property Details</h2>
            <div className={styles.propertySpecs}>
              {property.bedrooms && <div className={styles.specItem}><Bed className={styles.specIcon} /><span>{property.bedrooms} Bedroom</span></div>}
              {property.bathrooms && <div className={styles.specItem}><Bath className={styles.specIcon} /><span>{property.bathrooms} Bathroom</span></div>}
              {property.hasLivingRoom && <div className={styles.specItem}><Sofa className={styles.specIcon} /><span>Living Room</span></div>}
            </div>
          </div>

          {property.rentalType === 'entire' ? (
  <div className={styles.unitsAvailability}>
    <h3 className={styles.unitsTitle}>Rental Type</h3>
    <div className={styles.entireHouse}>
      <Home className={styles.rentalIcon} />
      <span>Entire House for Rent</span>
    </div>
  </div>
) : (
  Array.isArray(property.units) && property.units.length > 0 && (
    <div className={styles.unitsAvailability}>
      <h3 className={styles.unitsTitle}>Available Units</h3>
      <div className={styles.unitsList}>
        {property.units.map((unit: any, index: number) => (
          <div key={index} className={styles.unitItem}>
            <div className={styles.unitType}>
              <Users className={styles.unitIcon} />
              <span>{unit.type === 'private' ? 'Private Room' : 'Shared Room'}</span>
            </div>
            <div className={styles.unitQuantity}>
              <span>{unit.quantity} spot{unit.quantity > 1 ? 's' : ''} available</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
)}
          {(property.availableFrom || property.availableTo || property.price) && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Availability</h2>
              <div className={styles.availabilityInfo}>
                {property.availableFrom && <div className={styles.infoItem}><Calendar className={styles.infoIcon} /><span>Available from {formatDate(property.availableFrom)}</span></div>}
                {property.availableTo && <div className={styles.infoItem}><Calendar className={styles.infoIcon} /><span>Available until {formatDate(property.availableTo)}</span></div>}
                {property.price && <div className={styles.infoItem}><DollarSign className={styles.infoIcon} /><span>${property.price}{property.priceUnit}</span></div>}
              </div>
            </div>
          )}

          {property.description && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <p className={styles.description}>{property.description}</p>
            </div>
          )}

          {amenities.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Amenities</h2>
              <div className={styles.amenitiesList}>
                {amenities.map((item, index) => (
                  <div key={index} className={styles.amenityItem}><Check className={styles.amenityIcon} size={20} /><span>{item}</span></div>
                ))}
              </div>
            </div>
          )}

          {(property.contactName || property.showEmail || property.showPhone) && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Contact Information</h2>
              <div className={styles.contactInfo}>
                {property.contactName && <div className={styles.contactItem}><span className={styles.contactLabel}>Name:</span><span>{property.contactName}</span></div>}
                {property.showEmail && property.contactEmail && (
                  <div className={styles.contactItem}>
                    <Mail className={styles.contactIcon} />
                    <span>{property.contactEmail}</span>
                    <button className={styles.copyButton} onClick={() => copyToClipboard(property.contactEmail, 'email')}><Copy size={16} /></button>
                  </div>
                )}
                {property.showPhone && property.contactPhone && (
                  <div className={styles.contactItem}>
                    <Phone className={styles.contactIcon} />
                    <span>{property.contactPhone}</span>
                    <button className={styles.copyButton} onClick={() => copyToClipboard(property.contactPhone, 'phone')}><Copy size={16} /></button>
                  </div>
                )}
              </div>
            </div>
          )}

{property.latitude && property.longitude && (
  <div className={styles.mapPreview}>
    <iframe
      width="100%"
      height="300"
      frameBorder="0"
      style={{ border: 0, borderRadius: "8px", marginTop: '1rem' }}
      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDQ_3KM73-bkXIGncnCKhikoeVSmAV_Tzo&q=${property.latitude},${property.longitude}&zoom=15`}
      allowFullScreen
    ></iframe>
  </div>
)}

        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
