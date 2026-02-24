import { useState, useEffect, useRef } from "react";

export const useScrollProgress = () => {
    const [progress, setProgress] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        let rafId = null;
        let isVisible = false;
        let targetProgress = 0;
        let currentProgress = 0;

        const observer = new IntersectionObserver(([entry]) => {
            const becomingVisible = !isVisible && entry.isIntersecting;
            isVisible = entry.isIntersecting;
            if (becomingVisible) {
                rafId = requestAnimationFrame(update);
            }
        }, { threshold: 0 });

        const update = () => {
            if (!ref.current) return;

            // Calculate Target
            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const start = windowHeight;
            const end = -rect.height;
            const current = rect.top;

            let p = (start - current) / (start - end);
            targetProgress = Math.max(0, Math.min(1, p));

            // LERP for Ultra Smoothness (current + (target - current) * factor)
            // 0.15 gives a snappier but still premium follow effect
            currentProgress += (targetProgress - currentProgress) * 0.15;

            // Update state
            setProgress(currentProgress);

            // Continue loop if visible or if still smoothing
            if (isVisible || Math.abs(targetProgress - currentProgress) > 0.001) {
                rafId = requestAnimationFrame(update);
            }
        };

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
            rafId = requestAnimationFrame(update);
        }

        return () => {
            if (currentRef) observer.unobserve(currentRef);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return [ref, progress];
};
