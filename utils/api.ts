
import axios from 'axios';

// Client-side: "" (relative URL)
// Server-side: "http://localhost:3000/api" (direct to Next.js API Routes)
const baseURL = typeof window !== 'undefined'
    ? '/api'
    : (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SITE_URL}/api` : 'http://localhost:3000/api');

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Crucial for sending/receiving cookies (refresh token)
});

// Request interceptor to attach token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
    (response) => {
        // Axios wraps response in data, but sometimes we want just data
        // The original code returned response.data
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;
        let message = error.response?.data?.message || error.message;

        if (message === 'Network Error') {
            message = 'Server Error: The backend is unreachable. Please try again later.';
        }

        if (typeof window === 'undefined') {
            return Promise.reject(message);
        }

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/users/refresh') && !originalRequest.url.includes('/users/login')) {
            originalRequest._retry = true;
            try {
                // Try to refresh token
                const response = await axios.post(`${window.location.origin}/api/users/refresh`, {}, { withCredentials: true });
                // @ts-ignore
                const { token } = response.data;

                localStorage.setItem('token', token);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError: any) {
                // Refresh failed, clear everything and redirect to login if necessary
                localStorage.removeItem('token');
                if (window.location.pathname.startsWith('/admin')) {
                    window.location.href = '/admin/login';
                }
                return Promise.reject(refreshError.response?.data?.message || 'Session expired');
            }
        }

        return Promise.reject(message);
    }
);

export default api;
