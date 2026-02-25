import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile/tablet screens
 * @param {number} breakpoint - Breakpoint in pixels (default: 1024)
 * @returns {boolean} - True if screen width is less than breakpoint
 */
export const useIsMobile = (breakpoint = 1024) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return isMobile;
};
