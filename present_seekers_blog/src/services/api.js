import axios from 'axios';

// Base URL without the /api/blog part
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://seekersblog-production.up.railway.app'  // Production base
  : 'http://127.0.0.1:8000';                         // Development base

// Create main API instance
const api = axios.create({
  baseURL: `${BASE_URL}/api/blog`,  // Add /api/blog here for blog-specific endpoints
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const blogAPI = {
  // Blog endpoints (use the api instance with /api/blog base)
  getPosts: () => api.get('/posts/'),
  getPostsByCategory: (category) => api.get(`/posts/?category=${category}`),
  getPost: (id) => api.get(`/posts/${id}/`),
  getCategories: () => api.get('/categories/'),
  getFeaturedPosts: () => api.get('/posts/featured/'),
  incrementViews: (id) => api.post(`/posts/${id}/increment_views/`),
  toggleLike: (postId) => api.post(`/posts/${postId}/toggle_like/`),
  getComments: (postId) => api.get(`/posts/${postId}/comments/`),
  addComment: (postId, content) => api.post(`/posts/${postId}/add_comment/`, { content }),
  
  // Hero section endpoint (use axios directly with full URL)
  getHeroSection: () => axios.get(`${BASE_URL}/api/hero-section/`),
};

export default api;