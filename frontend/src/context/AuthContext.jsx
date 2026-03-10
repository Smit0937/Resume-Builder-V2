  import { createContext, useContext, useState, useEffect } from 'react';

  const AuthContext = createContext();

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      checkAuth();
    }, []);

    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication...');
        
        const res = await fetch('https://ai-resume-builder-bzgs.onrender.com/api/auth/me', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          console.log('✅ User authenticated:', data);
          setUser(data);
        } else {
          console.log('❌ Not authenticated');
          setUser(null);
        }
      } catch (err) {
        console.error('❌ Auth check failed:', err);
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
        await fetch('https://ai-resume-builder-bzgs.onrender.com/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
        console.log('✅ Logout successful');
      } catch (err) {
        console.error('❌ Logout error:', err);
      }
      
      setUser(null);
      // ✅ Don't navigate here - let components handle it
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