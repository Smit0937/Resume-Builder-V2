import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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
    
    // Check auth asynchronously without blocking UI
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 Checking authentication...');
      const data = await getCurrentUser();
      console.log('✅ User authenticated:', data);
      setUser(data);
      localStorage.setItem('cachedUser', JSON.stringify(data));
    } catch (err) {
      console.log('❌ Not authenticated:', err.message);
      setUser(null);
      localStorage.removeItem('cachedUser');
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
      console.log('🚪 Logging out...');
      await logoutUser();
      console.log('✅ Logout successful');
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
    
    setUser(null);
    localStorage.removeItem('cachedUser');
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