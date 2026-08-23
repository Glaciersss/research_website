// API 基础配置
const API_BASE_URL = '/api'

// 通用请求函数
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// API 方法
export const api = {
  // 新闻相关
  getNews: (page = 1, limit = 10) =>
    request(`/news?page=${page}&limit=${limit}`),

  getNewsById: (id) =>
    request(`/news/${id}`),

  // 学术成果相关
  getProjects: (type = 'all', page = 1, limit = 10) =>
    request(`/projects?type=${type}&page=${page}&limit=${limit}`),

  getProjectById: (id) =>
    request(`/projects/${id}`),

  getProjectsBatch: (ids) =>
    request(`/projects/batch?ids=${ids}`),

  // 团队成员相关
  getTeamMembers: (category = 'all') =>
    request(`/team?category=${category}`),

  getMemberById: (id) =>
    request(`/team/${id}`),

  // 联系表单
  submitContact: (data) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 通知公告
  getNotices: () =>
    request('/notices'),

  // 学术活动
  getEvents: () =>
    request('/events'),
}

export default api
