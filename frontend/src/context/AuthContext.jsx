import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Public routes that should never trigger an auth check ──
const PUBLIC_PATHS = [
  '/forgot-password',
  '/reset-password',
  '/login',
  '/register',
];

const isPublicPath = (pathname) =>
  PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
  pathname.includes('/preview');

// ── Ping backend, show wake screen if sleeping ──
async function wakeUpServer(onWaking, onReady) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${BACKEND_URL}/`, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) return true; // already awake
  } catch { /* sleeping */ }

  onWaking(); // show wake screen

  // Retry every 3s for up to 90s
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 3000));
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${BACKEND_URL}/`, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) { onReady(); return true; }
    } catch { /* still waking */ }
  }
  onReady(); // give up after 90s
  return false;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverWaking, setServerWaking] = useState(false);

  useEffect(() => {
    // ✅ Skip auth check entirely on public pages
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

    startAuthFlow();
  }, []);

  const startAuthFlow = async () => {
    await wakeUpServer(
      () => setServerWaking(true),
      () => setServerWaking(false),
    );
    await checkAuth();
  };

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
      setServerWaking(false);
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

  // ── Server waking up screen ──
  if (serverWaking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%)',
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: 24,
        textAlign: 'center',
      }}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, animation: 'fadeIn 0.5s ease' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M7 8h10M7 12h6M7 16h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
            Resume<span style={{ color: '#6366f1' }}>AI</span>
          </span>
        </div>

        {/* Spinner */}
        <div style={{
          width: 56, height: 56,
          border: '5px solid #e0e7ff',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
          marginBottom: 28,
        }} />

        {/* Message */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
          Starting up the server...
        </h2>
        <p style={{ fontSize: 14, color: '#64748b', maxWidth: 320, lineHeight: 1.6, margin: '0 0 28px' }}>
          Our free server takes <strong>~30 seconds</strong> to wake up after
          being idle. This only happens once — thank you for your patience! ☕
        </p>

        {/* Animated dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 10, height: 10,
              borderRadius: '50%',
              background: '#6366f1',
              animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite`,
            }} />
          ))}
        </div>

        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 28 }}>
          Free tier hosted on Render.com
        </p>
      </div>
    );
  }

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