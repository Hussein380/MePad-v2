import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
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
        api.put(`/meetings/${meetingId}/action-points/${actionId}`, data)
};

export const dashboard = {
    getData: () => api.get('/dashboard')
};

export default api; 