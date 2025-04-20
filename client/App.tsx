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

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

interface FavoritesContextType {
  favorites: Set<number>;
  toggleFavorite: (id: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  toggleFavorite: () => {},
});

export const useAuth = () => useContext(AuthContext);
export const useFavorites = () => useContext(FavoritesContext);

const DUMMY_CREDENTIALS = {
  username: 'user123',
  password: 'password123'
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = auth.login(username, password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials. Use username: user123, password: password123');
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
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={styles.input}
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
            />
          </div>

          <a href="#" className={styles.forgotPassword}>
            Forgot password?
          </a>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>

          <p className={styles.signupLink}>
            New User?{' '}
            <Link to="/signup">Create a new account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

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

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (username: string, password: string) => {
    if (username === DUMMY_CREDENTIALS.username && password === DUMMY_CREDENTIALS.password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

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

export default App