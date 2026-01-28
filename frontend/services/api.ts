import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API functions
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData: { username: string; email: string; password: string; firstName: string; lastName: string }) => 
    api.post('/auth/register', userData),
  
  getMe: () => 
    api.get('/auth/me'),
};

// User API functions
export const userAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string; role?: string }) => 
    api.get('/users', { params }),
  
  getById: (id: number) => 
    api.get(`/users/${id}`),
  
  update: (id: number, userData: { firstName: string; lastName: string; email: string; role: string; isActive: boolean }) => 
    api.put(`/users/${id}`, userData),
  
  delete: (id: number) => 
    api.delete(`/users/${id}`),
};

// Business API functions
export const businessAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string }) => 
    api.get('/business', { params }),
  
  getById: (id: number) => 
    api.get(`/business/${id}`),
  
  create: (entityData: { name: string; description: string; status: string; value: number }) => 
    api.post('/business', entityData),
  
  update: (id: number, entityData: { name: string; description: string; status: string; value: number }) => 
    api.put(`/business/${id}`, entityData),
  
  delete: (id: number) => 
    api.delete(`/business/${id}`),
};