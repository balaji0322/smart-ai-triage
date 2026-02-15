// API Service for Backend Communication

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Store auth token
let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('auth_token');
  }
  return authToken;
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('auth_token');
};

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`API Call: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log(`API Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const error = await response.json();
        console.error('API Error Response:', error);
        errorMessage = error.detail || error.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API Success Response:', data);
    return data;
  } catch (error: any) {
    console.error('API Call Error:', error);
    // Handle network errors
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check if backend is running on port 8000.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    age?: number;
    gender?: string;
    medical_history?: string;
  }) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(response.access_token);
    return response;
  },

  login: async (email: string, password: string) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(response.access_token);
    return response;
  },

  logout: () => {
    clearAuthToken();
  },
};

// Triage API
export const triageAPI = {
  analyze: async (data: {
    symptoms: Record<string, any>;
    vitals: Record<string, any>;
  }) => {
    return apiCall('/triage/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getHistory: async (patientId: string) => {
    return apiCall(`/triage/history/${patientId}`);
  },
};

// Doctor API
export const doctorAPI = {
  getPendingCases: async () => {
    return apiCall('/doctor/pending-cases');
  },

  updateStatus: async (triageId: string, status: string) => {
    return apiCall(`/doctor/update-status/${triageId}?status=${status}`, {
      method: 'PATCH',
    });
  },
};

// Admin API
export const adminAPI = {
  getAnalytics: async () => {
    return apiCall('/admin/analytics');
  },

  getSystemLogs: async (limit: number = 100) => {
    return apiCall(`/admin/system-logs?limit=${limit}`);
  },
};

export default {
  auth: authAPI,
  triage: triageAPI,
  doctor: doctorAPI,
  admin: adminAPI,
};
