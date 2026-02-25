import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

/**
 * Custom hook to fetch page content with caching
 */
export const usePageContent = (page, section = null) => {
    const queryKey = section ? ['content', page, section] : ['content', page];
    const url = section ? `/content?page=${page}&section=${section}` : `/content?page=${page}`;

    return useQuery({
        queryKey,
        queryFn: async () => api.get(url),
        staleTime: 30 * 60 * 1000, // 30 minutes for static-ish content
    });
};

/**
 * Custom hook to fetch blogs with caching
 */
export const useBlogs = () => {
    return useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            const data = await api.get('/blogs');
            return Array.isArray(data) ? data : [];
        },
        staleTime: 0, // Admin data should refetch on mount
    });
};

/**
 * Custom hook to fetch services with caching
 */
export const useServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const data = await api.get('/services');
            return Array.isArray(data) ? data : [];
        },
        staleTime: 0,
    });
};

/**
 * Custom hook to fetch solutions with caching
 */
export const useSolutions = () => {
    return useQuery({
        queryKey: ['solutions'],
        queryFn: async () => {
            const data = await api.get('/solutions');
            return Array.isArray(data) ? data : [];
        },
        staleTime: 0,
    });
};

/**
 * Custom hook to fetch leadership with caching
 */
export const useLeadership = () => {
    return useQuery({
        queryKey: ['leadership'],
        queryFn: async () => {
            const data = await api.get('/leadership');
            return Array.isArray(data) ? data : [];
        },
        staleTime: 0,
    });
};

/**
 * Custom hook to fetch navigation with caching
 */
export const useNavigationQuery = () => {
    return useQuery({
        queryKey: ['navigation'],
        queryFn: async () => {
            const data = await api.get('/navigation');
            if (Array.isArray(data)) {
                return data.sort((a, b) => (a.order || 0) - (b.order || 0));
            }
            return [];
        },
        staleTime: 60 * 60 * 1000, // 1 hour for navigation
        gcTime: 24 * 60 * 60 * 1000, // Keep in cache for a day
    });
};

/**
 * Custom hook to fetch settings with caching
 */
export const useSettingsQuery = () => {
    return useQuery({
        queryKey: ['settings'],
        queryFn: async () => api.get('/settings'),
        staleTime: 60 * 60 * 1000, // 1 hour
    });
};

/**
 * Custom hook to fetch admin dashboard stats
 */
export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const [enquiries, applications, subscribers, blogs, leadership, services, solutions] = await Promise.all([
                api.get('/enquiries').catch(() => []),
                api.get('/enquiries/careers').catch(() => []),
                api.get('/enquiries/subscribe').catch(() => []),
                api.get('/blogs').catch(() => []),
                api.get('/leadership').catch(() => []),
                api.get('/services').catch(() => []),
                api.get('/solutions').catch(() => [])
            ]);

            return {
                enquiries: Array.isArray(enquiries) ? enquiries.length : 0,
                applications: Array.isArray(applications) ? applications.length : 0,
                subscribers: Array.isArray(subscribers) ? subscribers.length : 0,
                blogs: Array.isArray(blogs) ? blogs.filter(b => b.published).length : 0,
                totalBlogs: Array.isArray(blogs) ? blogs.length : 0,
                leadership: Array.isArray(leadership) ? leadership.length : 0,
                services: Array.isArray(services) ? services.length : 0,
                solutions: Array.isArray(solutions) ? solutions.length : 0,
                recentEnquiries: Array.isArray(enquiries) ? enquiries.slice(0, 5) : [],
                recentApplications: Array.isArray(applications) ? applications.slice(0, 5) : [],
                recentSubscribers: Array.isArray(subscribers) ? subscribers.slice(0, 5) : [],
                hasNewEnquiries: Array.isArray(enquiries) ? enquiries.some(e => e.status === 'new') : false,
                hasNewApplications: Array.isArray(applications) ? applications.some(a => a.status === 'received') : false,
                hasNewSubscribers: Array.isArray(subscribers) ? subscribers.some(s => s.status === 'new') : false
            };
        },
        staleTime: 0,
    });
};

/**
 * Custom hook to fetch enquiries with caching
 */
export const useEnquiries = (type = 'projects') => {
    return useQuery({
        queryKey: ['enquiries', type],
        queryFn: async () => {
            let endpoint = '/enquiries';
            if (type === 'careers') endpoint = '/enquiries/careers';
            if (type === 'subscribers') endpoint = '/enquiries/subscribe';
            const data = await api.get(endpoint);
            return Array.isArray(data) ? data : [];
        },
        staleTime: 0,
    });
};

/**
 * Custom hook to fetch team members
 */
export const useTeam = () => {
    return useQuery({
        queryKey: ['team'],
        queryFn: async () => {
            const data = await api.get('/users');
            return Array.isArray(data) ? data : [];
        },
        staleTime: 0,
    });
};

/**
 * Custom hook to fetch current user profile
 */
export const useUserProfile = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return useQuery({
        queryKey: ['user', 'profile'],
        queryFn: async () => {
            if (!token) return null;
            return api.get('/users/profile');
        },
        enabled: !!token,
        staleTime: 10 * 60 * 1000,
    });
};

/**
 * Utility to prefetch data for faster navigation
 */
export const usePrefetch = () => {
    const queryClient = useQueryClient();

    const prefetchRoutes = {
        solutions: () => queryClient.prefetchQuery({ queryKey: ['solutions'], queryFn: async () => api.get('/solutions') }),
        services: () => queryClient.prefetchQuery({ queryKey: ['services'], queryFn: async () => api.get('/services') }),
        blogs: () => queryClient.prefetchQuery({ queryKey: ['blogs'], queryFn: async () => api.get('/blogs') }),
        leadership: () => queryClient.prefetchQuery({ queryKey: ['leadership'], queryFn: async () => api.get('/leadership') }),
        admin: () => queryClient.prefetchQuery({
            queryKey: ['admin', 'stats'],
            queryFn: async () => {
                const [enquiries, applications, subscribers, blogs, leadership, services, solutions] = await Promise.all([
                    api.get('/enquiries').catch(() => []),
                    api.get('/enquiries/careers').catch(() => []),
                    api.get('/enquiries/subscribe').catch(() => []),
                    api.get('/blogs').catch(() => []),
                    api.get('/leadership').catch(() => []),
                    api.get('/services').catch(() => []),
                    api.get('/solutions').catch(() => [])
                ]);
                return {
                    enquiries: Array.isArray(enquiries) ? enquiries.length : 0,
                    applications: Array.isArray(applications) ? applications.length : 0,
                    subscribers: Array.isArray(subscribers) ? subscribers.length : 0,
                    blogs: Array.isArray(blogs) ? blogs.filter(b => b.published).length : 0,
                    totalBlogs: Array.isArray(blogs) ? blogs.length : 0,
                    leadership: Array.isArray(leadership) ? leadership.length : 0,
                    services: Array.isArray(services) ? services.length : 0,
                    solutions: Array.isArray(solutions) ? solutions.length : 0,
                    recentEnquiries: Array.isArray(enquiries) ? enquiries.slice(0, 5) : [],
                    recentSubscribers: Array.isArray(subscribers) ? subscribers.slice(0, 5) : []
                };
            }
        }),
    };

    return prefetchRoutes;
};

