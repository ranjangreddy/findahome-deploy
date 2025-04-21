import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Logo from './components/Logo';
import SignUp from './components/SignUp';
import Home from './components/Home';
import PostProperty from './components/PostProperty';
import PreviewListing from './components/PreviewListing';
import PropertyDetails from './components/PropertyDetails';
import SavedHomes from './components/SavedHomes';
import styles from './components/Login.module.css';

// ---------- Context Interfaces ----------
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface FavoritesContextType {
  favorites: Set<number>;
  toggleFavorite: (id: number) => void;
}

// ---------- Contexts ----------
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  toggleFavorite: () => {},
});

export const useAuth = () => useContext(AuthContext);
export const useFavorites = () => useContext(FavoritesContext);

// ---------- Auth Provider ----------
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${process.env.API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Optional: Call backend logout endpoint
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------- Favorites Provider ----------
function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleFavorite = (id: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// ---------- Login Page ----------
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await auth.login(email, password);

    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <Logo />
        </div>

        <div className={styles.header}>
          <h2 className={styles.title}>Login</h2>
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <User className={styles.icon} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.icon} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.input}
              required
            />
          </div>

          <a href="#" className={styles.forgotPassword}>Forgot password?</a>

          <button type="submit" className={styles.loginButton}>Login</button>

          <p className={styles.signupLink}>
            New User? <Link to="/signup">Create a new account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// ---------- Auth Guard ----------
function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return auth.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

// ---------- App Component ----------
function App() {
  return (
    <AuthProvider>
      <Router>
        <FavoritesProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#fff',
                padding: '16px',
                borderRadius: '10px',
              },
              duration: 3000,
            }}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/saved-homes" element={<SavedHomes />} />
            <Route
              path="/post-property"
              element={
                <RequireAuth>
                  <PostProperty />
                </RequireAuth>
              }
            />
            <Route
              path="/preview-listing"
              element={
                <RequireAuth>
                  <PreviewListing />
                </RequireAuth>
              }
            />
          </Routes>
        </FavoritesProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
