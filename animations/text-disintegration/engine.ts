/**
 * Text disintegration engine (canvas-2D port of the effect in ./index.js).
 *
 * Takes the real, visible text of a container (every element matching `selector`),
 * rasterises each letter into fragments and plays the same "blown apart" motion as the
 * base demo: a left-to-right wave where every fragment shrinks, spins and flies outward.
 * `play()` disintegrates the text, `reverse()` pulls it back together.
 */

interface Glyph {
    ch: string;
    font: string;
    color: string;
    x: number; // left, relative to root
    y: number; // baseline, relative to root
    delay: number;
}

const WAVE = 0.55; // seconds the left→right wave takes to sweep the container
const MIN_DURATION = 0.7;
const MAX_DURATION = 1.3;
const CRISP_FADE = 0.18; // crisp glyph hands over to fragments over this long

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export interface Disintegration {
    play(): Promise<void>;
    reverse(): Promise<void>;
    destroy(): void;
}

export function createDisintegration(root: HTMLElement, selector = '[data-disintegrate]'): Disintegration {
    let canvas: HTMLCanvasElement | null = null;
    let raf = 0;
    let cancel: (() => void) | null = null;
    // Layout measured while the text is at rest (at play time); reused when reassembling so we never
    // re-measure letters that an in-view animation may have moved while the hero was off-screen.
    let cached: { key: string; built: ReturnType<typeof build> } | null = null;

    const targets = () => Array.from(root.querySelectorAll<HTMLElement>(selector));
    const setHidden = (hidden: boolean) =>
        targets().forEach((el) => {
            el.style.visibility = hidden ? 'hidden' : '';
        });

    // ---------- build glyphs + fragments from the live DOM ----------
    function build() {
        const rootRect = root.getBoundingClientRect();
        const W = rootRect.width;
        const H = rootRect.height;

        const measure = document.createElement('canvas').getContext('2d')!;
        const sample = document.createElement('canvas');
        const sctx = sample.getContext('2d', { willReadFrequently: true })!;

        const glyphs: Glyph[] = [];
        // fragment data, grouped per glyph
        const frag: { g: number; sx: number; sy: number; ex: number; ey: number; rot: number; delay: number; dur: number; size: number }[] = [];

        const range = document.createRange();

        for (const el of targets()) {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            let node: Node | null;
            while ((node = walker.nextNode())) {
                const parent = node.parentElement;
                const text = node.textContent || '';
                if (!parent || !text.trim()) continue;
                const cs = getComputedStyle(parent);
                if (cs.display === 'none') continue;

                const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
                const fontSize = parseFloat(cs.fontSize) || 16;
                let color = cs.color;
                if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') color = '#ffffff';
                const step = Math.min(5, Math.max(1.6, fontSize / 20));

                measure.font = font;

                for (let i = 0; i < text.length; i++) {
                    const ch = text[i];
                    if (/\s/.test(ch)) continue;
                    range.setStart(node, i);
                    range.setEnd(node, i + 1);
                    const r = range.getBoundingClientRect();
                    if (!r.width || !r.height) continue;

                    const ascent = measure.measureText(ch).fontBoundingBoxAscent ?? r.height * 0.8;
                    const left = r.left - rootRect.left;
                    const top = r.top - rootRect.top;
                    const g: Glyph = {
                        ch,
                        font,
                        color,
                        x: left,
                        y: top + ascent,
                        delay: Math.max(0, Math.min(1, (left + r.width / 2) / W)) * WAVE + rand(0, 0.08),
                    };
                    const gi = glyphs.push(g) - 1;

                    // rasterise this letter and turn its filled pixels into fragments
                    const pad = 2;
                    sample.width = Math.ceil(r.width) + pad * 2;
                    sample.height = Math.ceil(r.height) + pad * 2;
                    sctx.clearRect(0, 0, sample.width, sample.height);
                    sctx.font = font;
                    sctx.fillStyle = '#fff';
                    sctx.fillText(ch, pad, pad + ascent);
                    const data = sctx.getImageData(0, 0, sample.width, sample.height).data;

                    const cx = left + r.width / 2;
                    const cy = top + r.height / 2;
                    for (let y = 0; y < sample.height; y += step) {
                        for (let x = 0; x < sample.width; x += step) {
                            const a = data[((Math.floor(y) * sample.width) + Math.floor(x)) * 4 + 3];
                            if (a < 110) continue;
                            const px = left - pad + x;
                            const py = top - pad + y;
                            const dx = px - cx;
                            const dy = py - cy;
                            frag.push({
                                g: gi,
                                sx: px,
                                sy: py,
                                ex: px + dx * rand(2, 6) + rand(-90, 90),
                                ey: py + dy * rand(2, 6) + rand(-140, 30),
                                rot: Math.PI * rand(2, 6) * (Math.random() > 0.5 ? 1 : -1),
                                delay: g.delay + rand(0, 0.12),
                                dur: rand(MIN_DURATION, MAX_DURATION),
                                size: step * 0.95,
                            });
                        }
                    }
                }
            }
        }

        frag.sort((a, b) => a.g - b.g);
        let total = 0;
        for (const f of frag) total = Math.max(total, f.delay + f.dur);
        for (const g of glyphs) total = Math.max(total, g.delay + CRISP_FADE);
        return { W, H, glyphs, frag, total: total + 0.05 };
    }

    type Built = ReturnType<typeof build>;

    function render(ctx: CanvasRenderingContext2D, b: Built, t: number) {
        ctx.clearRect(0, 0, b.W, b.H);

        // crisp letters that haven't started (or are just starting) to break
        for (const g of b.glyphs) {
            const local = t - g.delay;
            if (local >= CRISP_FADE) continue;
            ctx.globalAlpha = local <= 0 ? 1 : 1 - local / CRISP_FADE;
            ctx.font = g.font;
            ctx.fillStyle = g.color;
            ctx.fillText(g.ch, g.x, g.y);
        }
        ctx.globalAlpha = 1;

        // fragments, batched per letter so the fill colour is set once
        let current = -1;
        let open = false;
        const flush = () => {
            if (open) ctx.fill();
            open = false;
        };
        for (const f of b.frag) {
            const p = (t - f.delay) / f.dur;
            if (p <= 0 || p >= 1) continue;
            if (f.g !== current) {
                flush();
                current = f.g;
                ctx.fillStyle = b.glyphs[current].color;
                ctx.beginPath();
                open = true;
            }
            const e = p * p;
            const x = f.sx + (f.ex - f.sx) * e;
            const y = f.sy + (f.ey - f.sy) * e;
            const s = f.size * (1 - p);
            const a = f.rot * p;
            ctx.moveTo(x + Math.cos(a) * s, y + Math.sin(a) * s);
            ctx.lineTo(x + Math.cos(a + 2.094) * s, y + Math.sin(a + 2.094) * s);
            ctx.lineTo(x + Math.cos(a + 4.189) * s, y + Math.sin(a + 4.189) * s);
            ctx.closePath();
        }
        flush();
    }

    function mountCanvas(b: Built) {
        removeCanvas();
        const dpr = window.devicePixelRatio || 1;
        canvas = document.createElement('canvas');
        canvas.width = Math.ceil(b.W * dpr);
        canvas.height = Math.ceil(b.H * dpr);
        Object.assign(canvas.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: '30',
        });
        root.appendChild(canvas);
        const ctx = canvas.getContext('2d')!;
        ctx.scale(dpr, dpr);
        ctx.textBaseline = 'alphabetic';
        return ctx;
    }

    function removeCanvas() {
        if (canvas) canvas.remove();
        canvas = null;
    }

    function run(direction: 'forward' | 'reverse'): Promise<void> {
        stop();
        const key = `${root.clientWidth}x${root.clientHeight}`;
        let b: Built;
        if (direction === 'reverse' && cached && cached.key === key) {
            b = cached.built;
        } else {
            b = build();
            if (direction === 'forward') cached = { key, built: b };
        }
        const ctx = mountCanvas(b);
        const speed = direction === 'forward' ? 1 : 1.25;
        let t = direction === 'forward' ? 0 : b.total;
        render(ctx, b, t);
        if (direction === 'forward') setHidden(true);

        return new Promise<void>((resolve) => {
            let last = performance.now();
            const finish = (completed: boolean) => {
                cancelAnimationFrame(raf);
                cancel = null;
                if (completed) {
                    if (direction === 'reverse') setHidden(false);
                    removeCanvas();
                }
                resolve();
            };
            cancel = () => finish(false);
            const tick = (now: number) => {
                const dt = Math.min(0.05, (now - last) / 1000);
                last = now;
                t += direction === 'forward' ? dt * speed : -dt * speed;
                const done = direction === 'forward' ? t >= b.total : t <= 0;
                if (done) {
                    t = direction === 'forward' ? b.total : 0;
                    render(ctx, b, t);
                    finish(true);
                    return;
                }
                render(ctx, b, t);
                raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
        });
    }

    function stop() {
        if (cancel) cancel();
    }

    return {
        play: () => run('forward'),
        reverse: () => run('reverse'),
        destroy() {
            cached = null;
            stop();
            removeCanvas();
            setHidden(false);
        },
    };
}
