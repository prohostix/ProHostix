import { useAnimation, useTransform, useMotionValue } from "framer-motion";
import { useIsMobile } from "./useIsMobile";

/**
 * useCardMotion
 *
 * - Scroll-driven mode when scrollYProgress is provided (Services)
 * - Viewport-based mode when not provided (Blogs)
 * - Blog cards are visible on load AND animate
 */
export const useCardMotion = (index = 0, scrollYProgress = null) => {
    const isMobile = useIsMobile();

    /* ---------------- SAFE MOTION VALUE ---------------- */
    const fallback = useMotionValue(1);
    const progress = scrollYProgress || fallback;

    /* ---------------- SCROLL-DRIVEN MODE (Services) ---------------- */
    const y = useTransform(progress, [0, 0.4], [isMobile ? 40 : 100 + index * 16, 0]);
    const x = useTransform(
        progress,
        [0, 0.4],
        isMobile ? [0, 0] : (index % 3 === 0 ? [-40, 0] : index % 3 === 1 ? [0, 0] : [40, 0])
    );
    const rotate = useTransform(
        progress,
        [0, 0.4],
        isMobile ? [0, 0] : (index % 2 === 0 ? [-2, 0] : [2, 0])
    );
    const opacity = useTransform(progress, [0, 0.2], [0.6, 1]);

    if (scrollYProgress) {
        return {
            style: {
                y,
                x,
                rotate,
                opacity,
                willChange: "transform, opacity"
            }
        };
    }

    /* ---------------- VIEWPORT MODE (Blogs) ---------------- */
    return {
        initial: {
            opacity: 0.85,
            y: isMobile ? 20 : 40,
            x: isMobile ? 0 : (index % 2 === 0 ? -16 : 16),
            scale: isMobile ? 1 : 0.97
        },

        whileInView: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1
        },

        viewport: {
            once: true,
            amount: isMobile ? 0.1 : 0.2
        },

        transition: {
            type: isMobile ? "tween" : "spring",
            duration: isMobile ? 0.4 : undefined,
            stiffness: isMobile ? undefined : 150,
            damping: isMobile ? undefined : 18,
            delay: isMobile ? 0 : index * 0.05
        },
        style: {
            willChange: "transform, opacity"
        }
    };
};
