const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Helper function to add timeout to fetch requests
const fetchWithTimeout = (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
};

const api = {
  get: async (endpoint) => {
    const res = await fetchWithTimeout(`${API_URL}/api${endpoint}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Request failed');
    }
    return { data: await res.json() };
  },
  
  post: async (endpoint, body) => {
    const res = await fetchWithTimeout(`${API_URL}/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Request failed');
    }
    return { data: await res.json() };
  },
  
  put: async (endpoint, body) => {
    const res = await fetchWithTimeout(`${API_URL}/api${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Request failed');
    }
    return { data: await res.json() };
  },
  
  delete: async (endpoint) => {
    const res = await fetchWithTimeout(`${API_URL}/api${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Request failed');
    }
    return { data: await res.json() };
  },
};

export default api;
export { API_URL };  // ← MAKE SURE THIS LINE EXISTS!