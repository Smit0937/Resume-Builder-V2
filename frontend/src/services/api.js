const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🔍 API initialized with URL:', API_URL);

const api = {
  get: async (endpoint) => {
    const url = `${API_URL}/api${endpoint}`;
    console.log('🔍 GET:', url);
    
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('❌ GET failed:', error);
      throw new Error(error.error || 'Request failed');
    }

    const data = await res.json();
    return { data };
  },

  post: async (endpoint, body) => {
    const url = `${API_URL}/api${endpoint}`;
    console.log('🔍 POST:', url, body);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('❌ POST failed:', error);
      throw new Error(error.error || 'Request failed');
    }

    const data = await res.json();
    return { data };
  },

  put: async (endpoint, body) => {
    const url = `${API_URL}/api${endpoint}`;
    console.log('🔍 PUT:', url, body);
    
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('❌ PUT failed:', error);
      throw new Error(error.error || 'Request failed');
    }

    const data = await res.json();
    return { data };
  },

  delete: async (endpoint) => {
    const url = `${API_URL}/api${endpoint}`;
    console.log('🔍 DELETE:', url);
    
    const res = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('❌ DELETE failed:', error);
      throw new Error(error.error || 'Request failed');
    }

    const data = await res.json();
    return { data };
  },
};

export default api;
export { API_URL };  // ✅ EXPORT API_URL