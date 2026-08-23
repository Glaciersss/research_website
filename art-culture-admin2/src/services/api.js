import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  verify: () => api.post('/auth/verify'),
}

export const newsAPI = {
  getAll: (page = 1, limit = 20) => api.get(`/admin/news?page=${page}&limit=${limit}`),
  getTeachingAll: () => api.get('/admin/news/teaching'),
  getById: id => api.get(`/admin/news/${id}`),
  getTeachingById: id => api.get(`/admin/news/teaching/${id}`),
  create: data => api.post('/admin/news', data),
  createTeaching: data => api.post('/admin/news/teaching', data),
  update: (id, data) => api.put(`/admin/news/${id}`, data),
  updateTeaching: (id, data) => api.put(`/admin/news/teaching/${id}`, data),
  delete: id => api.delete(`/admin/news/${id}`),
  deleteTeaching: id => api.delete(`/admin/news/teaching/${id}`),
}

export const projectsAPI = {
  getAll: (page = 1, limit = 20) => api.get(`/admin/projects?page=${page}&limit=${limit}`),
  getById: id => api.get(`/admin/projects/${id}`),
  create: data => api.post('/admin/projects', data),
  update: (id, data) => api.put(`/admin/projects/${id}`, data),
  delete: id => api.delete(`/admin/projects/${id}`),
}

export const teamAPI = {
  getAll: () => api.get('/admin/team'),
  getById: id => api.get(`/admin/team/${id}`),
  create: data => api.post('/admin/team', data),
  update: (id, data) => api.put(`/admin/team/${id}`, data),
  delete: id => api.delete(`/admin/team/${id}`),
  updateSort: items => api.put('/admin/team/sort', { items }),
}

export const noticesAPI = {
  getAll: () => api.get('/admin/notices'),
  create: data => api.post('/admin/notices', data),
  update: (id, data) => api.put(`/admin/notices/${id}`, data),
  delete: id => api.delete(`/admin/notices/${id}`),
}

export const eventsAPI = {
  getAll: () => api.get('/admin/events'),
  create: data => api.post('/admin/events', data),
  update: (id, data) => api.put(`/admin/events/${id}`, data),
  delete: id => api.delete(`/admin/events/${id}`),
}

export const uploadAPI = {
  uploadImage: file => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/admin/upload/image', formData, {
      transformRequest: [(data, headers) => {
        delete headers['Content-Type']
        return data
      }],
    })
  },
  uploadPdf: file => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/admin/upload/pdf', formData, {
      transformRequest: [(data, headers) => {
        delete headers['Content-Type']
        return data
      }],
    })
  },
}

export const statsAPI = {
  get: () => api.get('/admin/stats'),
}

export default api
