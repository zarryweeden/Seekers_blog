import axios from 'axios';

const API_BASE_URL = 'https://seekers-blog.onrender.com/api/blog';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const blogAPI = {
  // Get all blog posts
  getPosts: () => api.get('/posts/'),
  
  // Get posts by category
  getPostsByCategory: (category) => api.get(`/posts/?category=${category}`),
  
  // Get single post by ID
  getPost: (id) => api.get(`/posts/${id}/`),
  
  // Get all categories
  getCategories: () => api.get('/categories/'),
  
  // Get featured posts
  getFeaturedPosts: () => api.get('/posts/featured/'),
  
  // Increment views
  incrementViews: (id) => api.post(`/posts/${id}/increment_views/`),
};



export default api;