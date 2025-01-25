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
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            // Return the entire response, don't throw an error here
            return response;
        } catch (error) {
            // Pass through the original error with its response data
            throw error;
        }
    },
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me')
};

export const meetings = {
    create: async (data) => {
        try {
            const response = await api.post('/meetings', data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to create meeting');
        }
    },
    getAll: async () => {
        try {
            const response = await api.get('/meetings');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to fetch meetings');
        }
    },
    getOne: async (id) => {
        try {
            const response = await api.get(`/meetings/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to fetch meeting');
        }
    },
    update: (id, data) => api.put(`/meetings/${id}`, data),
    delete: (id) => api.delete(`/meetings/${id}`),
    updateActionPoint: (meetingId, actionId, data) => 
        api.put(`/meetings/${meetingId}/action-points/${actionId}`, data)
};

export const dashboard = {
    getData: () => api.get('/dashboard')
};

export default api; 