import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0, // Always consider data stale by default for immediate updates
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: true, // Refetch when window gains focus
            refetchOnMount: true, // Refetch on component mount
            retry: 1,
            networkMode: 'online',
        },
    },
});
