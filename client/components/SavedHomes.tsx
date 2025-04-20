import React from 'react';
import { MapPin, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../App';
import styles from './SavedHomes.module.css';

function SavedHomes() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const apartments = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&h=250",
      title: "Modern Downtown Apartment",
      price: "1200",
      priceUnit: "/month",
      specs: "2 Bed / 1 Bath",
      address: "123 Main Street, Boston, MA 02108"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&h=250",
      title: "Luxury Waterfront Condo",
      price: "80",
      priceUnit: "/day",
      specs: "1 Bed / 1 Bath",
      address: "456 Harbor View, Boston, MA 02110"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&h=250",
      title: "Cozy Studio in Back Bay",
      price: "950",
      priceUnit: "/month",
      specs: "Studio / 1 Bath",
      address: "789 Newbury St, Boston, MA 02116"
    }
  ];

  const savedHomes = apartments.filter(apartment => favorites.has(apartment.id));

  const handlePropertyClick = (id: number) => {
    navigate(`/property/${id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Heart className={styles.titleIcon} />
          Saved Homes
        </h1>
        <p className={styles.subtitle}>
          {savedHomes.length} {savedHomes.length === 1 ? 'home' : 'homes'} saved
        </p>
      </div>

      {savedHomes.length > 0 ? (
        <div className={styles.propertyGrid}>
          {savedHomes.map((apartment) => (
            <div 
              key={apartment.id} 
              className={styles.propertyCard}
              onClick={() => handlePropertyClick(apartment.id)}
            >
              <div className={styles.propertyImage}>
                <img src={apartment.image} alt={apartment.title} />
                <div className={styles.propertyPrice}>
                  ${apartment.price}{apartment.priceUnit}
                </div>
                <button
                  className={`${styles.favoriteButton} ${favorites.has(apartment.id) ? styles.active : ''}`}
                  onClick={(e) => handleFavoriteClick(e, apartment.id)}
                >
                  <Heart className={styles.favoriteIcon} />
                </button>
              </div>
              <div className={styles.propertyDetails}>
                <h3 className={styles.propertyTitle}>{apartment.title}</h3>
                <div className={styles.propertySpecs}>{apartment.specs}</div>
                <div className={styles.propertyLocation}>
                  <MapPin size={16} />
                  <span>{apartment.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Heart className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>No saved homes yet</h2>
          <p className={styles.emptyText}>
            Start saving homes by clicking the heart icon on any property
          </p>
          <button 
            className={styles.browseButton}
            onClick={() => navigate('/')}
          >
            Browse Homes
          </button>
        </div>
      )}
    </div>
  );
}

export default SavedHomes;