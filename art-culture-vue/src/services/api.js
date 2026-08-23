import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// ====== News (public) ======
export const newsAPI = {
  getList(page = 1, limit = 10) {
    return apiClient.get('/news', { params: { page, limit } })
  },
  getById(id) {
    return apiClient.get(`/news/${id}`)
  }
}

// ====== Projects (public) ======
export const projectsAPI = {
  getList(type = '', page = 1, limit = 10) {
    return apiClient.get('/projects', { params: { type, page, limit } })
  },
  getById(id) {
    return apiClient.get(`/projects/${id}`)
  },
  getBatch(ids) {
    return apiClient.get('/projects/batch', { params: { ids } })
  }
}

// ====== Team (public) ======
export const teamAPI = {
  getList(category = '') {
    return apiClient.get('/team', { params: { category } })
  },
  getById(id) {
    return apiClient.get(`/team/${id}`)
  },
  getBatch(ids) {
    return apiClient.get('/team/batch', { params: { ids } })
  }
}

// ====== Contact (public) ======
export const contactAPI = {
  submit(data) {
    return apiClient.post('/contact', data)
  }
}

// ====== Notices (public) ======
export const noticesAPI = {
  getList() {
    return apiClient.get('/notices')
  }
}

// ====== Events (public) ======
export const eventsAPI = {
  getList() {
    return apiClient.get('/events')
  }
}

// ====== Hero Background (public) ======
export const heroBgAPI = {
  get() {
    return apiClient.get('/public/hero-bg')
  }
}

export default apiClient
