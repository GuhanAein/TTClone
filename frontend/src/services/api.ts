import axios from 'axios';
import type { AuthResponse, LoginRequest, SignUpRequest, Task, TaskRequest, TaskList, TaskListRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/auth/refresh`, null, {
                        params: { refreshToken },
                    });
                    const { accessToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
    register: (data: SignUpRequest) => api.post<AuthResponse>('/auth/register', data),
    getCurrentUser: () => api.get('/auth/me'),
    refreshToken: (refreshToken: string) =>
        api.post<AuthResponse>('/auth/refresh', null, { params: { refreshToken } }),
};

// Task API
export const taskAPI = {
    getAll: () => api.get<Task[]>('/tasks'),
    getById: (id: number) => api.get<Task>(`/tasks/${id}`),
    getByList: (listId: number) => api.get<Task[]>(`/tasks/list/${listId}`),
    getToday: () => api.get<Task[]>('/tasks/today'),
    getOverdue: () => api.get<Task[]>('/tasks/overdue'),
    search: (query: string) => api.get<Task[]>('/tasks/search', { params: { query } }),
    create: (data: TaskRequest) => api.post<Task>('/tasks', data),
    update: (id: number, data: TaskRequest) => api.put<Task>(`/tasks/${id}`, data),
    delete: (id: number) => api.delete(`/tasks/${id}`),
};

// TaskList API
export const taskListAPI = {
    getAll: () => api.get<TaskList[]>('/lists'),
    getById: (id: number) => api.get<TaskList>(`/lists/${id}`),
    create: (data: TaskListRequest) => api.post<TaskList>('/lists', data),
    update: (id: number, data: TaskListRequest) => api.put<TaskList>(`/lists/${id}`, data),
    delete: (id: number) => api.delete(`/lists/${id}`),
};

// Habit API
export const habitAPI = {
    getAll: () => api.get('/habits'),
    create: (data: any) => api.post('/habits', data),
    toggle: (id: number, date: string) => api.post(`/habits/${id}/toggle`, null, { params: { date } }),
    delete: (id: number) => api.delete(`/habits/${id}`),
};

export default api;
