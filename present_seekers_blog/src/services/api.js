import axios from 'axios';

// For local development - use your local Django server
const API_BASE_URL = 'http://127.0.0.1:8000/api/blog';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const blogAPI = {
  getPosts: () => api.get('/posts/'),
  getPostsByCategory: (category) => api.get(`/posts/?category=${category}`),
  getPost: (id) => api.get(`/posts/${id}/`),
  getCategories: () => api.get('/categories/'),
  getFeaturedPosts: () => api.get('/posts/featured/'),
  incrementViews: (id) => api.post(`/posts/${id}/increment_views/`),
};

export default api;