import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 登录
export const login = (data) => api.post('/auth/login', data)

// Dashboard 数据
export const getDashboardData = () => api.get('/admin/dashboard')

// 竞赛管理
export const getCompetitions = (params) => api.get('/competitions', { params })
export const createCompetition = (data) => api.post('/competitions', data)
export const updateCompetition = (id, data) => api.put(`/competitions/${id}`, data)
export const deleteCompetition = (id) => api.delete(`/competitions/${id}`)

// 用户管理
export const getUsers = (params) => api.get('/users', { params })
export const updateUser = (id, data) => api.put(`/users/${id}`, data)
export const deleteUser = (id) => api.delete(`/users/${id}`)

// 帖子管理
export const getProjects = (params) => api.get('/projects', { params })
export const createProject = (data) => api.post('/projects', data)
export const updateProject = (id, data) => api.put(`/projects/${id}`, data)
export const deleteProject = (id) => api.delete(`/projects/${id}`)
export const getTalentProfiles = (params) => api.get('/talent-profiles', { params })
export const deleteTalentProfile = (id) => api.delete(`/talent-profiles/${id}`)
export const toggleTalentProfileStatus = (id) => api.patch(`/users/talent-profiles/${id}/toggle-status`)

export default api