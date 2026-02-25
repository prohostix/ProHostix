'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
                setIsLoading(false);
            } else {
                try {
                    // Try to refresh token
                    const res: any = await api.post('/users/refresh');
                    const newToken = res.token;
                    localStorage.setItem('token', newToken);

                    // Fetch user info since we recovered session
                    const me = await api.get('/users/me');
                    localStorage.setItem('user', JSON.stringify(me));

                    setIsAuthenticated(true);
                } catch (error) {
                    setIsAuthenticated(false);
                    router.replace('/admin/login');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        verifySession();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return <>{children}</>;
};

export default ProtectedRoute;
