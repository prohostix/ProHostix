import React from 'react';

const DarkBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#0b0b0b]">

            {/* Depth gradient (dark-grey dominant) */}
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(135deg, #0b0b0b 0%, #151515 100%)",
                    opacity: 0.28,
                }}
            />

            {/* Subtle AI accent (barely-there emerald hint) */}
            <div
                className="absolute top-[12%] right-[8%] w-[42%] h-[42%] rounded-full blur-[160px]"
                style={{
                    background: "rgba(6, 78, 59, 0.04)",
                }}
            />

            {/* Neutral intelligence grid */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
                    backgroundSize: "64px 64px",
                }}
            />

            {/* Light grain (organic depth) */}
            <div className="absolute inset-0 opacity-[0.015] mix-blend-soft-light">
                <svg
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    <filter id="noise">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.8"
                            numOctaves="4"
                            stitchTiles="stitch"
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
            </div>
        </div>
    );
};

export default DarkBackground;
