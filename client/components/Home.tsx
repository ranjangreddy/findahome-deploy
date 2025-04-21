import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, LogIn, UserPlus, Home as HomeIcon, PlusSquare, Heart, LogOut, MapPin, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth, useFavorites } from '../App';
import styles from './Home.module.css';

function Home() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userListings, setUserListings] = useState<any[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const { isAuthenticated, logout } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      async function fetchUserListings() {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/my-listings`, {
            credentials: 'include',
          });
          if (res.ok) {
            const data = await res.json();
            setUserListings(data);
          } else {
            console.error('Failed to load user properties');
          }
        } catch (err) {
          console.error('API Error:', err);
        }
      }
      fetchUserListings();
    }
  }, [isAuthenticated]);

  useEffect(() => {
   
    fetchProperties();
  }, []);
  async function fetchProperties() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/properties`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAllProperties(data);
      } else {
        console.error('Failed to load properties');
      }
    } catch (err) {
      console.error('API Error:', err);
    }
  }

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

  const handleMenuClick = () => setShowDropdown(!showDropdown);
  const handleLogout = () => { logout(); navigate('/login'); };
  const handlePropertyClick = (id: number, isUserListing: boolean) => {
    if (isAuthenticated || isUserListing) {
      navigate(`/property/${id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast((t) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Please login to save properties</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate('/login');
            }}
            style={{ background: '#007A33', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
          >
            Login
          </button>
        </div>
      ));
      return;
    }
    toggleFavorite(id);
  };

  const handleDeleteListing = async (id: number) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/properties/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setUserListings(prev => prev.filter(item => item.id !== id));
        toast.success('Listing deleted successfully')
        fetchProperties();
      } else {
        toast.error('Failed to delete listing');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  

  const filteredApartments = allProperties.filter(property => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const text = `${property.title || property.name} ${property.location} ${property.bedrooms} bed ${property.bathrooms} bath`.toLowerCase();
    return searchTerms.every(term => text.includes(term));
  });

  const filteredUserListings = userListings.filter(listing => {
    if (!searchQuery) return true;
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const listingText = `${listing.name} ${listing.location} ${listing.bedrooms} bed ${listing.bathrooms} bath`.toLowerCase();
    return searchTerms.every(term => listingText.includes(term));
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={`${styles.searchBar} ${searchFocused ? styles.focused : ''}`}>
          <Search className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by location, property type, or features..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
        <div className={styles.menuContainer} ref={menuRef}>
          <button className={styles.menuButton} onClick={handleMenuClick}><Menu /></button>
          {showDropdown && (
            <div className={styles.menuDropdown} ref={dropdownRef}>
              {!isAuthenticated ? (
                <>
                  <button className={styles.menuItem} onClick={() => navigate('/login')}><LogIn /><span>Login</span></button>
                  <button className={styles.menuItem} onClick={() => navigate('/signup')}><UserPlus /><span>Sign Up</span></button>
                  <button className={styles.menuItem} onClick={() => navigate('/post-property')}><PlusSquare /><span>Post Property</span></button>
                </>
              ) : (
                <>
                  {/* <button className={styles.menuItem} onClick={() => navigate('/dashboard')}><HomeIcon /><span>Dashboard</span></button> */}
                  {/* <button className={styles.menuItem} onClick={() => navigate('/saved-homes')}><Heart /><span>Saved Homes ({favorites.size})</span></button> */}
                  <button className={styles.menuItem} onClick={() => navigate('/post-property')}><PlusSquare /><span>Post Property</span></button>
                  <button className={styles.menuItem} onClick={handleLogout}><LogOut /><span>Logout</span></button>
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
              {filteredUserListings.map((property) => (
                <div key={property.id} className={styles.propertyCard} onClick={() => handlePropertyClick(property.id, true)}>
                  <div className={styles.propertyImage}>
                  <img
  src={(() => {
    try {
      const urls = JSON.parse(property.imageUrls);
      return urls?.[0] || '';
    } catch (err) {
      return '';
    }
  })()}
  alt={property.name}
/>

                    <div className={styles.propertyPrice}>${property.price}{property.priceUnit}</div>
                    <button className={styles.deleteButton} onClick={(e) => { e.stopPropagation(); handleDeleteListing(property.id); }}>
                      <Trash2 className={styles.deleteIcon} />
                    </button>
                  </div>
                  <div className={styles.propertyDetails}>
                    <h3 className={styles.propertyTitle}>{property.name}</h3>
                    <div className={styles.propertySpecs}>{property.bedrooms} Bed / {property.bathrooms} Bath</div>
                    <div className={styles.propertyLocation}><MapPin size={16} /><span>{property.location}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className={styles.sectionTitle}>{searchQuery ? `Search Results (${filteredApartments.length})` : 'Featured Rentals'}</h2>
          {filteredApartments.length > 0 ? (
            <div className={styles.propertyGrid}>
              {filteredApartments.map((apartment) => (
                                <div key={apartment.id} className={styles.propertyCard} onClick={() => handlePropertyClick(apartment.id, true)}>

                <div key={apartment.id} className={styles.propertyCard}>
                  <div className={styles.propertyImage}>
                  <img
  src={(() => {
    try {
      const urls = JSON.parse(apartment.imageUrls)
      return Array.isArray(urls) ? urls[0] : '';
    } catch {
      return '';
    }
  })()}
  alt={apartment.title || apartment.name}
/>

                    <div className={styles.propertyPrice}>${apartment.price}{apartment.priceUnit}</div>
                    <button className={`${styles.favoriteButton} ${favorites.has(apartment.id) ? styles.active : ''}`} onClick={(e) => handleFavoriteClick(e, apartment.id)}>
                      <Heart className={styles.favoriteIcon} />
                    </button>
                  </div>
                  <div className={styles.propertyDetails}>
                    <h3 className={styles.propertyTitle}>{apartment.title || apartment.name}</h3>
                    <div className={styles.propertySpecs}>{apartment.bedrooms} Bed / {apartment.bathrooms} Bath</div>
                    <div className={styles.propertyLocation}><MapPin size={16} /><span>{apartment.location}</span></div>
                  </div>
                </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}><p>No properties found matching your search criteria</p></div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
