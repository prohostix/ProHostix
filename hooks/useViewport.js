import { useState, useEffect } from 'react';

/**
 * Custom hook to detect viewport dimensions
 * @returns {object} - { width, height, isMobile, isShort }
 */
export const useViewport = () => {
    const [viewport, setViewport] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    });

    useEffect(() => {
        const handleResize = () => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = viewport.width < 768;
    const isTablet = viewport.width >= 768 && viewport.width < 1024;
    const isDesktop = viewport.width >= 1024;
    const isShort = viewport.height < 800;

    return {
        ...viewport,
        isMobile,
        isTablet,
        isDesktop,
        isShort,
        forceHamburger: isMobile || (isTablet && isShort)
    };
};
