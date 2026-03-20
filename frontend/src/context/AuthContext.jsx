import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

// ── Public routes that should never trigger an auth check ──
const PUBLIC_PATHS = [
  '/forgot-password',
  '/reset-password',
  '/login',
  '/register',
   
];

const isPublicPath = (pathname) =>
  PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  pathname.includes('/preview');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Skip auth check entirely on public pages — prevents 30s timeout
    if (isPublicPath(window.location.pathname)) {
      setLoading(false);
      return;
    }

    const cachedUser = localStorage.getItem('cachedUser');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        localStorage.removeItem('cachedUser');
      }
    }

    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 AUTH: Checking authentication with backend...');
      const data = await getCurrentUser();
      console.log('✅ AUTH: User authenticated:', data.email);
      setUser(data);
      localStorage.setItem('cachedUser', JSON.stringify(data));
    } catch (err) {
      console.log('❌ AUTH: User not authenticated:', err.message);
      setUser(null);
      localStorage.removeItem('cachedUser');
      sessionStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    console.log('✅ Login - setting user:', userData);
    setUser(userData);
    localStorage.setItem('cachedUser', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      console.log('🚪 LOGOUT: Attempting to call logout API...');
      const result = await logoutUser();
      console.log('✅ LOGOUT: API call successful', result);
    } catch (err) {
      console.error('⚠️ LOGOUT: API call failed:', err.message);
    }

    console.log('🧹 LOGOUT: Clearing all local data...');
    setUser(null);
    localStorage.removeItem('cachedUser');
    sessionStorage.clear();
    clearAllCookies();
    console.log('✅ LOGOUT: Complete - user data cleared locally');
  };

  const clearAllCookies = () => {
    try {
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
      console.log('🧹 Cleared all accessible cookies via JS');
    } catch (e) {
      console.warn('⚠️ Could not clear cookies via JS (httpOnly?):', e.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};