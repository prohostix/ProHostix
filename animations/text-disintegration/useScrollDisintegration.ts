import { useEffect, useRef } from 'react';
import { createDisintegration } from './engine';

interface Options {
    /** Runs (and is awaited) right before the text starts to break, e.g. to let entry animations settle. */
    beforeDisintegrate?: () => Promise<void> | void;
    /** Called once the hero text is back to normal after scrolling back up. */
    onRestored?: () => void;
}

const SCROLL_MS = 1100;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function tweenScroll(to: number, ms: number): Promise<void> {
    const from = window.scrollY;
    return new Promise((resolve) => {
        const start = performance.now();
        const tick = (now: number) => {
            const p = Math.min(1, (now - start) / ms);
            window.scrollTo({ top: from + (to - from) * easeInOutCubic(p), behavior: 'instant' as ScrollBehavior });
            if (p < 1) requestAnimationFrame(tick);
            else resolve();
        };
        requestAnimationFrame(tick);
    });
}

/**
 * One scroll gesture on the hero disintegrates its text and glides to the next section;
 * scrolling up from that section pulls the text back together.
 * Desktop (lg+) only, and skipped for reduced-motion users.
 */
export function useScrollDisintegration(rootRef: React.RefObject<HTMLElement | null>, options: Options = {}) {
    const opts = useRef(options);
    opts.current = options;

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const engine = createDisintegration(root);
        let gone = false;
        let busy = false;
        let cooldownUntil = 0;

        const active = () =>
            window.matchMedia('(min-width: 1024px)').matches &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const heroBottom = () => root.getBoundingClientRect().bottom + window.scrollY;
        const settle = () => {
            busy = false;
            cooldownUntil = performance.now() + 900;
        };

        async function down() {
            busy = true;
            await opts.current.beforeDisintegrate?.();
            const target = heroBottom();
            await Promise.all([engine.play(), wait(450).then(() => tweenScroll(target, SCROLL_MS))]);
            gone = true;
            settle();
        }

        async function up() {
            busy = true;
            await Promise.all([wait(250).then(() => engine.reverse()), tweenScroll(0, SCROLL_MS)]);
            gone = false;
            opts.current.onRestored?.();
            settle();
        }

        // direction: 1 = down, -1 = up. Returns true if the event was taken over.
        function request(direction: number, e: Event): boolean {
            if (!active()) return false;
            if (busy || performance.now() < cooldownUntil) {
                e.preventDefault();
                return true;
            }
            if (!gone && direction > 0 && window.scrollY < heroBottom() * 0.5) {
                e.preventDefault();
                void down();
                return true;
            }
            if (gone && direction < 0 && window.scrollY <= heroBottom() + 30) {
                e.preventDefault();
                void up();
                return true;
            }
            return false;
        }

        const onWheel = (e: WheelEvent) => {
            if (e.deltaY === 0) return;
            request(e.deltaY > 0 ? 1 : -1, e);
        };

        let touchY = 0;
        const onTouchStart = (e: TouchEvent) => {
            touchY = e.touches[0].clientY;
        };
        const onTouchMove = (e: TouchEvent) => {
            const dy = touchY - e.touches[0].clientY;
            if (Math.abs(dy) < 40) {
                if (busy) e.preventDefault();
                return;
            }
            if (request(dy > 0 ? 1 : -1, e)) touchY = e.touches[0].clientY;
        };

        const onKey = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement)?.closest?.('input, textarea, select, button, a, [contenteditable="true"]')) return;
            if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') request(1, e);
            else if (e.key === 'ArrowUp' || e.key === 'PageUp') request(-1, e);
        };

        // Back at the top by other means (scrollbar, nav link): just reassemble the text.
        const onScroll = () => {
            if (gone && !busy && window.scrollY < heroBottom() * 0.3) {
                busy = true;
                engine.reverse().then(() => {
                    gone = false;
                    opts.current.onRestored?.();
                    settle();
                });
            }
        };

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('keydown', onKey);
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('scroll', onScroll);
            engine.destroy();
        };
    }, [rootRef]);
}
