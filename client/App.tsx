import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { User, Lock, Facebook, Twitter } from 'lucide-react';
import Logo from './components/Logo';
import SignUp from './components/SignUp';
import Home from './components/Home';
import PostProperty from './components/PostProperty';
import PreviewListing from './components/PreviewListing';
import styles from './components/Login.module.css';

// Create auth context
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

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

          <a href="#" className={styles.forgotPassword}>
            Forgot password?
          </a>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>Or continue with</span>
        </div>

        <div className={styles.socialButtons}>
          <button className={styles.socialButton}>
            <img
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
              alt="Google"
              style={{ height: '24px' }}
            />
          </button>
          <button className={styles.socialButton}>
            <Facebook color="#1877F2" />
          </button>
          <button className={styles.socialButton}>
            <Twitter color="#1DA1F2" />
          </button>
        </div>

        <p className={styles.signupLink}>
          New User? <Link to="/signup">Create a new account</Link>
        </p>
      </div>
    </div>
  );
}

// 🔒 Auth guard
function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// ✅ Updated AuthProvider with real API integration
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
  
      if (res.ok) {
        setIsAuthenticated(false); // Set isAuthenticated to false
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
