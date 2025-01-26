import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const auth = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me')
};

export const meetings = {
    create: (data) => api.post('/meetings', data),
    getAll: () => api.get('/meetings'),
    getOne: (id) => api.get(`/meetings/${id}`),
    update: (id, data) => api.put(`/meetings/${id}`, data),
    delete: (id) => api.delete(`/meetings/${id}`),
    updateActionPoint: (meetingId, actionId, data) => 
        api.put(`/meetings/${meetingId}/action-points/${actionId}`, data),
    addActionPoint: (meetingId, actionPoint) => 
        api.post(`/meetings/${meetingId}/action-points`, actionPoint),
    deleteActionPoint: (meetingId, actionId) => 
        api.delete(`/meetings/${meetingId}/action-points/${actionId}`)
};

export const dashboard = {
    getData: () => api.get('/dashboard')
};

export default api; 