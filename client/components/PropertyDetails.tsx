import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Droplet, Home, Wind, Zap, Flame, School as Pool, Dumbbell, Shield } from 'lucide-react';
import styles from './PropertyDetails.module.css';

const DUMMY_PROPERTY = {
  id: 1,
  name: "JVUE Apartment",
  location: "Boston, MA",
  price: 85,
  description: "Experience luxury living in this modern apartment featuring stunning city views and premium amenities. Perfect for both short and long-term stays, this space offers the perfect blend of comfort and style.",
  rating: 3.5,
  reviews: 32,
  images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&h=800",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&h=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&h=800"
  ],
  amenities: [
    { name: "WiFi", icon: Wifi },
    { name: "Free Parking", icon: Car },
    { name: "Hot Water", icon: Droplet },
    { name: "In-House Laundry", icon: Home },
    { name: "AC", icon: Wind },
    { name: "Electricity", icon: Zap },
    { name: "Gas", icon: Flame },
    { name: "Swimming Pool", icon: Pool },
    { name: "Gym", icon: Dumbbell },
    { name: "Security", icon: Shield }
  ]
};

function PropertyDetails() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [review, setReview] = useState('');

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className={styles.star} fill="currentColor" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className={`${styles.star} ${styles.half}`} fill="currentColor" />);
      } else {
        stars.push(<Star key={i} className={`${styles.star} ${styles.empty}`} />);
      }
    }

    return stars;
  };

  const handleImageDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReview('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageSlider}>
          <img
            src={DUMMY_PROPERTY.images[currentImageIndex]}
            alt={DUMMY_PROPERTY.name}
            className={styles.mainImage}
          />
          <div className={styles.sliderNav}>
            {DUMMY_PROPERTY.images.map((_, index) => (
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
              <h1 className={styles.title}>{DUMMY_PROPERTY.name}</h1>
              <div className={styles.location}>
                <MapPin size={18} />
                <span>{DUMMY_PROPERTY.location}</span>
              </div>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {renderStars(DUMMY_PROPERTY.rating)}
                </div>
                <span className={styles.reviews}>
                  ({DUMMY_PROPERTY.reviews} reviews)
                </span>
              </div>
            </div>
            <div className={styles.price}>
              ${DUMMY_PROPERTY.price}/Day
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Description 
            </h2>
            <p className={styles.description}>{DUMMY_PROPERTY.description}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Amenities</h2>
            <div className={styles.amenitiesList}>
              {DUMMY_PROPERTY.amenities.map((amenity, index) => (
                <div key={index} className={styles.amenityItem}>
                  <amenity.icon className={styles.amenityIcon} size={20} />
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Location</h2>
            <div className={styles.map}>
              {/* Map integration would go here */}
            </div>
          </div>

          <div className={styles.reviewSection}>
            <h2 className={styles.sectionTitle}>Reviews</h2>
            <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
              <textarea
                className={styles.reviewInput}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review..."
                rows={4}
              />
              <button type="submit" className={styles.actionButton}>
                Check Availability
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;