import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
}

// Festival APIs
export const festivalApi = {
  getAll: (params) => api.get('/festivals', { params }),
  getById: (id) => api.get(`/festivals/${id}`),
  getBySlug: (slug) => api.get(`/festivals/slug/${slug}`),
  getRandomContent: (id, relationshipId) =>
    api.get(`/festivals/${id}/random-content`, {
      params: { relationship_id: relationshipId },
    }),
  getQuotes: (id) => api.get(`/festivals/${id}/quotes`),
  getImages: (id) => api.get(`/festivals/${id}/images`),
}

// Relationship APIs
export const relationshipApi = {
  getAll: (category) => api.get('/relationships', { params: { category } }),
  getCategories: () => api.get('/relationships/categories'),
}

// Wish APIs
export const wishApi = {
  create: (data) => api.post('/wishes/create', data),
  preview: (params) => api.get('/wishes/preview', { params }),
  getById: (id) => api.get(`/wishes/${id}`),
  generateCard: (id) => api.post(`/wishes/${id}/generate-card`),
  download: (id) => api.get(`/wishes/${id}/download`),
  getHistory: () => api.get('/wishes/history'),
  getChannels: () => api.get('/wishes/channels/available'),
}

// Image APIs
export const imageApi = {
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getMyImages: () => api.get('/images/my-images'),
  delete: (id) => api.delete(`/images/${id}`),
  getFestivalImages: (festivalId) => api.get(`/images/festival/${festivalId}`),
}

export default api
