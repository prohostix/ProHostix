'use client';

import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import SmoothScroll from './SmoothScroll';
import store from '@/store';
import { queryClient } from '@/utils/queryClient';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <SmoothScroll />
                {children}
            </QueryClientProvider>
        </Provider>
    );
}
