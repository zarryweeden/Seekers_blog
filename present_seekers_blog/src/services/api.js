import axios from 'axios';

// Use different URLs for development vs production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://seekersblog-production.up.railway.app/api/blog'  // Production
  : 'http://127.0.0.1:8000/api/blog';                         // Development

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const blogAPI = {
  getPosts: () => api.get('/posts/'),
  getPostsByCategory: (category) => api.get(`/posts/?category=${category}`),
  getPost: (id) => api.get(`/posts/${id}/`),
  getCategories: () => api.get('/categories/'),
  getHeroSection: () => api.get('/api/hero-section/'),
  getFeaturedPosts: () => api.get('/posts/featured/'),
  incrementViews: (id) => api.post(`/posts/${id}/increment_views/`),
  toggleLike: (postId) => api.post(`/posts/${postId}/toggle_like/`),
  getComments: (postId) => api.get(`/posts/${postId}/comments/`),
  addComment: (postId, content) => api.post(`/posts/${postId}/add_comment/`, { content }),
};

export default api;









