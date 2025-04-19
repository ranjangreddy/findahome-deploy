import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, LogIn, UserPlus, Home as HomeIcon, PlusSquare, Package, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import styles from './Home.module.css';

function Home() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userListings, setUserListings] = useState<any[]>([]);
  const { isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const storedProperty = localStorage.getItem('propertyData');
      if (storedProperty) {
        setUserListings([JSON.parse(storedProperty)]);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        menuRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePropertyClick = (id: number) => {
    navigate(`/property/${id}`);
  };

  const apartments = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&h=250",
      title: "JVUE Apartment 1",
      rating: 4.5,
      reviews: 234
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&h=250",
      title: "JVUE Apartment 2",
      rating: 4.8,
      reviews: 186
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&h=250",
      title: "JVUE Apartment 3",
      rating: 0,
      reviews: 0
    }
  ];

  const renderStars = (rating: number, reviews: number) => {
    if (reviews === 0) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={styles.star}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={`${styles.star} ${styles.half}`}>★</span>);
      } else {
        stars.push(<span key={i} className={`${styles.star} ${styles.empty}`}>★</span>);
      }
    }

    return stars;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={`${styles.searchBar} ${searchFocused ? styles.focused : ''}`}>
          <Search className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search apartments..." 
            className={styles.searchInput}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
        <div className={styles.menuContainer} ref={menuRef}>
          <button className={styles.menuButton} onClick={handleMenuClick}>
            <Menu />
          </button>
          {showDropdown && (
            <div className={styles.menuDropdown} ref={dropdownRef}>
              {!isAuthenticated ? (
                <>
                  <button className={styles.menuItem} onClick={() => navigate('/login')}>
                    <LogIn />
                    <span>Login</span>
                  </button>
                  <button className={styles.menuItem} onClick={() => navigate('/signup')}>
                    <UserPlus />
                    <span>Sign Up</span>
                  </button>
                  <button className={styles.menuItem} onClick={() => navigate('/post-property')}>
                    <PlusSquare />
                    <span>Post Property</span>
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.menuItem} onClick={() => navigate('/dashboard')}>
                    <HomeIcon />
                    <span>Dashboard</span>
                  </button>
                  <button className={styles.menuItem} onClick={() => navigate('/my-listings')}>
                    <Package />
                    <span>My Listings ({userListings.length})</span>
                  </button>
                  <button className={styles.menuItem} onClick={() => navigate('/post-property')}>
                    <PlusSquare />
                    <span>Post Property</span>
                  </button>
                  <button className={styles.menuItem} onClick={handleLogout}>
                    <LogOut />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <main className={styles.content}>
        {isAuthenticated && userListings.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>My Listings</h2>
            <div className={styles.propertyGrid}>
              {userListings.map((property, index) => (
                <div 
                  key={index} 
                  className={styles.propertyCard}
                  onClick={() => handlePropertyClick(index + 1)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.propertyImage}>
                    <img src={property.photoUrls[0]} alt={property.name} />
                  </div>
                  <div className={styles.propertyDetails}>
                    <h3 className={styles.propertyTitle}>{property.name}</h3>
                    <div className={styles.propertyInfo}>
                      <p className={styles.propertyType}>{property.type}</p>
                      <p className={styles.propertyPrice}>${property.price}/day</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className={styles.sectionTitle}>Popular Apartments</h2>
          <div className={styles.propertyGrid}>
            {apartments.map((apartment) => (
              <div 
                key={apartment.id} 
                className={styles.propertyCard}
                onClick={() => handlePropertyClick(apartment.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.propertyImage}>
                  <img src={apartment.image} alt={apartment.title} />
                </div>
                <div className={styles.propertyDetails}>
                  <h3 className={styles.propertyTitle}>{apartment.title}</h3>
                  {apartment.reviews > 0 ? (
                    <div className={styles.rating}>
                      <div className={styles.stars}>
                        {renderStars(apartment.rating, apartment.reviews)}
                      </div>
                      <span className={styles.ratingText}>
                        {apartment.rating.toFixed(1)} ({apartment.reviews})
                      </span>
                    </div>
                  ) : (
                    <div className={styles.noReviews}>
                      No reviews yet
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;