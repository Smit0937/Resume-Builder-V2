import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ CHECK AUTH ON PAGE LOAD
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 Checking authentication...');
      
      const data = await getCurrentUser();
      console.log('✅ User authenticated:', data);
      setUser(data);
      
    } catch (err) {
      console.log('❌ Not authenticated:', err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    console.log('✅ Login - setting user:', userData);
    setUser(userData);
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