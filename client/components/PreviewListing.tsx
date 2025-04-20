import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Edit, Check, Mail, Phone, Home, Bath, Sofa } from 'lucide-react';
import styles from './PreviewListing.module.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UnitConfig {
  type: 'private' | 'shared';
  quantity: number;
}

interface PropertyData {
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
  latitude:any,
  longitude:any,
}

function PreviewListing() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('propertyData');
    if (data) {
      setPropertyData(JSON.parse(data));
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const uploadImagesAndGetUrls = async (photoUrls: string[]): Promise<string[]> => {
    const urls: string[] = [];

    for (const url of photoUrls) {
      if (url.startsWith('blob:')) {
        const blob = await fetch(url).then(res => res.blob());
        const formData = new FormData();
        formData.append('image', blob, `property-${Date.now()}.png`);

        const uploadRes = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await uploadRes.json();
        urls.push(data.url);
      } else {
        urls.push(url);
      }
    }

    return urls;
  };

  if (!propertyData) {
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
          <p className={styles.subtitle}>Review your property details before publishing</p>
        </div>

        <div className={styles.content}>
          <div className={styles.imageGrid}>
            {propertyData.photoUrls.length > 0 ? (
              propertyData.photoUrls.map((url, index) => (
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
              <h2 className={styles.propertyName}>{propertyData.name}</h2>
              <span className={styles.propertyType}>{propertyData.type}</span>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoItem}>
                <MapPin className={styles.infoIcon} />
                <span>{propertyData.location}</span>
              </div>
              <div className={styles.infoItem}>
                <DollarSign className={styles.infoIcon} />
                <span>${propertyData.price}{propertyData.priceUnit}</span>
              </div>
              <div className={styles.infoItem}>
                <Calendar className={styles.infoIcon} />
                <span>
                  Available from {formatDate(propertyData.availableFrom)}
                  {propertyData.availableTo && ` to ${formatDate(propertyData.availableTo)}`}
                </span>
              </div>
            </div>

            <div className={styles.rentalTypeSection}>
              <h3 className={styles.sectionTitle}>Available Units</h3>
              <div className={styles.rentalTypeInfo}>
                {propertyData.rentalType === 'entire' ? (
                  <div className={styles.entireHouse}>
                    <Home className={styles.rentalIcon} />
                    <span>Entire House for Rent</span>
                  </div>
                ) : (
                  <div className={styles.unitsList}>
                    {propertyData.units.map((unit, index) => (
                      <div key={index} className={styles.unitItem}>
                        <span className={styles.unitType}>{unit.type} Room</span>
                        <span className={styles.unitQuantity}>× {unit.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <h3 className={styles.sectionTitle}>Property Details</h3>

            <div className={styles.propertySpecs}>
              <div className={styles.specItem}>
                <Home className={styles.specIcon} />
                <span>{propertyData.bedrooms} Bedroom{propertyData.bedrooms > 1 ? 's' : ''}</span>
              </div>
              <div className={styles.specItem}>
                <Bath className={styles.specIcon} />
                <span>{propertyData.bathrooms} Bathroom{propertyData.bathrooms > 1 ? 's' : ''}</span>
              </div>
              {propertyData.hasLivingRoom && (
                <div className={styles.specItem}>
                  <Sofa className={styles.specIcon} />
                  <span>Living Room</span>
                </div>
              )}
            </div>

            <div className={styles.descriptionSection}>
              <h3 className={styles.sectionTitle}>Description</h3>
              <p className={styles.description}>{propertyData.description}</p>
            </div>

            <div className={styles.amenitiesSection}>
              <h3 className={styles.sectionTitle}>Amenities</h3>
              <div className={styles.amenitiesList}>
                {propertyData.amenities.map((amenity) => (
                  <span key={amenity} className={styles.amenityTag}>
                    <Check className={styles.amenityIcon} />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.contactSection}>
              <h3 className={styles.sectionTitle}>Contact Information</h3>
              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Name:</span>
                  <span>{propertyData.contactName}</span>
                </div>
                {propertyData.showEmail && (
                  <div className={styles.contactItem}>
                    <Mail className={styles.contactIcon} />
                    <span>{propertyData.contactEmail}</span>
                  </div>
                )}
                {propertyData.showPhone && (
                  <div className={styles.contactItem}>
                    <Phone className={styles.contactIcon} />
                    <span>{propertyData.contactPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => navigate('/post-property')}
            className={styles.editButton}
          >
            <Edit className={styles.buttonIcon} />
            Edit Listing
          </button>
          <button
            onClick={async () => {
              if (!propertyData || loading) return;
              setLoading(true);
              try {
                const uploadedUrls = await uploadImagesAndGetUrls(propertyData.photoUrls);
                const payload = {
                  title: propertyData.name,
                  type: propertyData.type,
                  description: propertyData.description,
                  location: propertyData.location,
                  bedrooms: Number(propertyData.bedrooms),
                  bathrooms: Number(propertyData.bathrooms),
                  hasLivingRoom: propertyData.hasLivingRoom,
                  rentalType: propertyData.rentalType,
                  amenities: propertyData.amenities,
                  imageUrls: uploadedUrls,
                  price: parseFloat(propertyData.price),
                  priceUnit: propertyData.priceUnit,
                  availableFrom: propertyData.availableFrom,
                  availableTo: propertyData.availableTo || null,
                  contactName: propertyData.contactName,
                  contactEmail: propertyData.contactEmail,
                  showEmail: propertyData.showEmail,
                  contactPhone: propertyData.contactPhone,
                  showPhone: propertyData.showPhone,
                  units: propertyData.units || [],
                  latitude:propertyData.latitude,
                  longitude:propertyData.longitude,
                };

                const res = await fetch('/api/properties', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify(payload),
                });

                const data = await res.json();

                if (res.ok) {
                  toast.success('Property successfully published!', { autoClose: 3000 });
                  localStorage.removeItem('propertyData');
                  setTimeout(() => navigate('/'), 500);
                } else {
                  toast.error(data.error || 'Something went wrong.');
                }
              } catch (err) {
                console.error('Error publishing property:', err);
                toast.error('Server error. Please try again later.');
              } finally {
                setLoading(false);
              }
            }}
            className={styles.publishButton}
            disabled={loading}
          >
            {loading ? <div className={styles.loadingDot} /> : <Check className={styles.buttonIcon} />}
            {loading ? 'Publishing...' : 'Publish Listing'}
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default PreviewListing;
