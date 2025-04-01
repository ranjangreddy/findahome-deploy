import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Edit, Check } from 'lucide-react';
import styles from './PreviewListing.module.css';

interface PropertyData {
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

function PreviewListing() {
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('propertyData');
    if (data) {
      setProperty(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  const handlePublish = async () => {
    try {
      if (!property) return;

      const res = await fetch('http://localhost:3000/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: property.title,
          description: property.description,
          location: property.location,
          price: parseFloat(property.price),
          imageUrl: property.photoUrls[0] || '',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Property published successfully!');
        localStorage.removeItem('propertyData');
        navigate('/');
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error publishing property:', err);
      alert('Server error. Try again later.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || !property) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingSpinner} />
          <p>Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.previewCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Preview Your Listing</h1>
          <p className={styles.subtitle}>Review your property before publishing</p>
        </div>

        <div className={styles.content}>
          <div className={styles.imageGrid}>
            {property.photoUrls.length > 0 ? (
              property.photoUrls.map((url, index) => (
                <div
                  key={index}
                  className={`${styles.imageContainer} ${index === 0 ? styles.mainImage : ''}`}
                >
                  <img src={url} alt={`Property ${index + 1}`} />
                </div>
              ))
            ) : (
              <div className={styles.noImages}>
                <p>No images uploaded</p>
              </div>
            )}
          </div>

          <div className={styles.propertyDetails}>
            <div className={styles.titleSection}>
              <h2 className={styles.propertyName}>{property.title}</h2>
              <span className={styles.propertyType}>{property.type}</span>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoItem}>
                <MapPin className={styles.infoIcon} />
                <span>{property.location}</span>
              </div>
              <div className={styles.infoItem}>
                <DollarSign className={styles.infoIcon} />
                <span>${property.price} per day</span>
              </div>
              <div className={styles.infoItem}>
                <Calendar className={styles.infoIcon} />
                <span>
                  {formatDate(property.availableFrom)} - {formatDate(property.availableTo)}
                </span>
              </div>
            </div>

            <div className={styles.descriptionSection}>
              <h3 className={styles.sectionTitle}>Description</h3>
              <p className={styles.description}>{property.description}</p>
            </div>

            <div className={styles.amenitiesSection}>
              <h3 className={styles.sectionTitle}>Amenities</h3>
              <div className={styles.amenitiesList}>
                {property.amenities.map((amenity) => (
                  <span key={amenity} className={styles.amenityTag}>
                    <Check className={styles.amenityIcon} />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={() => navigate('/post-property')} className={styles.editButton}>
            <Edit className={styles.buttonIcon} />
            Edit Listing
          </button>
          <button onClick={handlePublish} className={styles.publishButton}>
            <Check className={styles.buttonIcon} />
            Publish Listing
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreviewListing;
