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
  const { isAuthenticated, logout } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
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
            style={{
              background: '#007A33',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </div>
      ));
      return;
    }
    toggleFavorite(id);
  };

  const handleDeleteListing = (index: number) => {
    setUserListings(prev => prev.filter((_, i) => i !== index));
    localStorage.removeItem('propertyData');
    toast.success('Listing deleted successfully');
  };

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

  const filteredApartments = apartments.filter(apartment => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const apartmentText = `${apartment.title} ${apartment.address} ${apartment.specs}`.toLowerCase();
    
    return searchTerms.every(term => apartmentText.includes(term));
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
                  <button className={styles.menuItem} onClick={() => navigate('/saved-homes')}>
                    <Heart />
                    <span>Saved Homes ({favorites.size})</span>
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
              {filteredUserListings.map((property, index) => (
                <div 
                  key={index} 
                  className={styles.propertyCard}
                  onClick={() => handlePropertyClick(index + 1)}
                >
                  <div className={styles.propertyImage}>
                    <img src={property.photoUrls[0]} alt={property.name} />
                    <div className={styles.propertyPrice}>
                      ${property.price}{property.priceUnit}
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteListing(index);
                      }}
                    >
                      <Trash2 className={styles.deleteIcon} />
                    </button>
                  </div>
                  <div className={styles.propertyDetails}>
                    <h3 className={styles.propertyTitle}>{property.name}</h3>
                    <div className={styles.propertySpecs}>
                      {property.bedrooms} Bed / {property.bathrooms} Bath
                    </div>
                    <div className={styles.propertyLocation}>
                      <MapPin size={16} />
                      <span>{property.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className={styles.sectionTitle}>
            {searchQuery ? `Search Results (${filteredApartments.length})` : 'Popular Apartments'}
          </h2>
          {filteredApartments.length > 0 ? (
            <div className={styles.propertyGrid}>
              {filteredApartments.map((apartment) => (
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
            <div className={styles.noResults}>
              <p>No properties found matching your search criteria</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;