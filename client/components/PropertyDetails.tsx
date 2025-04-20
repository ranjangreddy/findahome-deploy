import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MapPin, Wifi, Car, Droplet, Home, Wind, Zap, Flame, School as Pool, 
  Dumbbell, Shield, Heart, Mail, Phone, Calendar, DollarSign, Bath, Bed, Sofa, Users, Copy, Check 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useFavorites } from '../App';
import styles from './PropertyDetails.module.css';

const DUMMY_PROPERTY = {
  id: 1,
  name: "JVUE Apartment",
  location: "Boston, MA",
  price: 85,
  priceUnit: "/day",
  description: "Experience luxury living in this modern apartment featuring stunning city views and premium amenities. Perfect for both short and long-term stays, this space offers the perfect blend of comfort and style.",
  images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&h=800",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&h=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&h=800"
  ],
  bedrooms: 2,
  bathrooms: 2,
  hasLivingRoom: true,
  availableFrom: "2024-04-01",
  availableTo: "2024-12-31",
  rentalType: "units",
  units: [
    { type: "private", quantity: 2 },
    { type: "shared", quantity: 1 }
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
  ],
  contact: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 000-0000",
    showEmail: true,
    showPhone: true
  }
};

function PropertyDetails() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { favorites, toggleFavorite } = useFavorites();
  const propertyId = parseInt(id || '1');

  const handleImageDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageSlider}>
          <img
            src={DUMMY_PROPERTY.images[currentImageIndex]}
            alt={DUMMY_PROPERTY.name}
            className={styles.mainImage}
          />
          <button
            className={`${styles.favoriteButton} ${favorites.has(propertyId) ? styles.active : ''}`}
            onClick={() => toggleFavorite(propertyId)}
          >
            <Heart className={styles.favoriteIcon} />
          </button>
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
            </div>
            <div className={styles.price}>
              ${DUMMY_PROPERTY.price}{DUMMY_PROPERTY.priceUnit}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Property Details</h2>
            <div className={styles.propertySpecs}>
              <div className={styles.specItem}>
                <Bed className={styles.specIcon} />
                <span>{DUMMY_PROPERTY.bedrooms} Bedroom{DUMMY_PROPERTY.bedrooms > 1 ? 's' : ''}</span>
              </div>
              <div className={styles.specItem}>
                <Bath className={styles.specIcon} />
                <span>{DUMMY_PROPERTY.bathrooms} Bathroom{DUMMY_PROPERTY.bathrooms > 1 ? 's' : ''}</span>
              </div>
              {DUMMY_PROPERTY.hasLivingRoom && (
                <div className={styles.specItem}>
                  <Sofa className={styles.specIcon} />
                  <span>Living Room</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Availability</h2>
            <div className={styles.availabilityInfo}>
              <div className={styles.infoItem}>
                <Calendar className={styles.infoIcon} />
                <span>Available from {formatDate(DUMMY_PROPERTY.availableFrom)}</span>
              </div>
              {DUMMY_PROPERTY.availableTo && (
                <div className={styles.infoItem}>
                  <Calendar className={styles.infoIcon} />
                  <span>Available until {formatDate(DUMMY_PROPERTY.availableTo)}</span>
                </div>
              )}
              <div className={styles.infoItem}>
                <DollarSign className={styles.infoIcon} />
                <span>${DUMMY_PROPERTY.price}{DUMMY_PROPERTY.priceUnit}</span>
              </div>
            </div>

            {DUMMY_PROPERTY.rentalType === 'units' && (
              <div className={styles.unitsAvailability}>
                <h3 className={styles.unitsTitle}>Available Units</h3>
                <div className={styles.unitsList}>
                  {DUMMY_PROPERTY.units.map((unit, index) => (
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
            )}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Description</h2>
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
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Name:</span>
                <span>{DUMMY_PROPERTY.contact.name}</span>
              </div>
              {DUMMY_PROPERTY.contact.showEmail && (
                <div className={styles.contactItem}>
                  <Mail className={styles.contactIcon} />
                  <span>{DUMMY_PROPERTY.contact.email}</span>
                  <button 
                    className={styles.copyButton}
                    onClick={() => copyToClipboard(DUMMY_PROPERTY.contact.email, 'email')}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              )}
              {DUMMY_PROPERTY.contact.showPhone && (
                <div className={styles.contactItem}>
                  <Phone className={styles.contactIcon} />
                  <span>{DUMMY_PROPERTY.contact.phone}</span>
                  <button 
                    className={styles.copyButton}
                    onClick={() => copyToClipboard(DUMMY_PROPERTY.contact.phone, 'phone')}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Location</h2>
            <div className={styles.map}>
              {/* Map integration would go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;