import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const blogAPI = {
  // Get all blog posts
  getPosts: () => api.get('/blog/posts/'),
  
  // Get posts by category
  getPostsByCategory: (category) => api.get(`/blog/posts/?category=${category}`),
  
  // Get single post by ID
  getPost: (id) => api.get(`/blog/posts/${id}/`),
  
  // Get all categories
  getCategories: () => api.get('/blog/categories/'),
  
  // Get featured posts
  getFeaturedPosts: () => api.get('/blog/posts/featured/'),
  
  // Increment views
  incrementViews: (id) => api.post(`/blog/posts/${id}/increment_views/`),
};



export default api;