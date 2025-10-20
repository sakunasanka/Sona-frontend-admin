// api/api.ts
import axios from 'axios';


const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.MODE === 'development'
      ? 'https://sona.org.lk/api'
      : 'http://localhost:5001/api'),
});

// Automatically attach token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default API;


