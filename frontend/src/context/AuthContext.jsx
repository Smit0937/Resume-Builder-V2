import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // ✅ CRITICAL: Start with loading=true to prevent PrivateRoute redirecting before auth check
  const [loading, setLoading] = useState(true);

  // ✅ NON-BLOCKING AUTH CHECK - Only on first page load
  useEffect(() => {
    // Don't block render - check auth in background
    const cachedUser = localStorage.getItem('cachedUser');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        localStorage.removeItem('cachedUser');
      }
    }
    
    // Always verify with backend on page load
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
      // ✅ On any auth error (401, network, etc), clear cached user
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
      // Continue even if API fails - we'll clear locally
    }
    
    // ✅ ALWAYS clear local state regardless of API response
    console.log('🧹 LOGOUT: Clearing all local data...');
    setUser(null);
    localStorage.removeItem('cachedUser');
    sessionStorage.clear();
    
    // ✅ Alternative: Try to clear cookies via JavaScript (for cases where API didn't clear them)
    // Note: Can't directly delete httpOnly cookies from JS, but we can clear everything we can
    clearAllCookies();
    
    console.log('✅ LOGOUT: Complete - user data cleared locally');
  };
  
  // ✅ Helper to clear all accessible cookies
  const clearAllCookies = () => {
    try {
      // Clear all non-httpOnly cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
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