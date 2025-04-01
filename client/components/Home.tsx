import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Menu, LogIn, UserPlus, Home as HomeIcon,
  PlusSquare, Package, LogOut, MapPin, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import styles from './Home.module.css';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
}

function Home() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/properties', {
          credentials: 'include'
        });
        const data = await res.json();

        if (res.ok) {
          setProperties(data);
        } else {
          setError(data.error || 'Failed to fetch properties');
        }
      } catch (err) {
        console.error(err);
        setError('Server error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleMenuClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from AuthContext
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
                    <span>My Listings</span>
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
        <section>
          <h2 className={styles.sectionTitle}>Available Properties</h2>

          {loading ? (
            <p className={styles.loading}>Loading properties...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : properties.length === 0 ? (
            <p className={styles.empty}>No properties posted yet.</p>
          ) : (
            <div className={styles.propertyGrid}>
              {properties.map((property) => (
                <div key={property.id} className={styles.propertyCard}>
                  <div className={styles.propertyImage}>
                    <img
                      src={property.imageUrl || 'https://via.placeholder.com/400x250'}
                      alt={property.title}
                    />
                  </div>
                  <div className={styles.propertyDetails}>
                    <h3 className={styles.propertyTitle}>{property.title}</h3>
                    <div className={styles.propertyMeta}>
                      <span><MapPin size={16} /> {property.location}</span>
                      <span><DollarSign size={16} /> ₹{property.price}/day</span>
                    </div>
                    {/* <button
                      className={styles.viewButton}
                      onClick={() => navigate('/preview-listing')}
                    >
                      View Details
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
