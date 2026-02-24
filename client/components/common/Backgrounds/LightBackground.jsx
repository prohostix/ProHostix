import React from 'react';

const LightBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#fafafa]">
            {/* Warm subtle gradient for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)",
                }}
            />

            {/* Faint emerald ambient glow for brand continuity */}
            <div
                className="absolute top-[12%] right-[8%] w-[42%] h-[42%] rounded-full blur-[140px]"
                style={{
                    background: "rgba(16, 185, 129, 0.04)", // Emerald-500 equivalent but very faint
                }}
            />

            {/* Dark grid lines (low opacity) */}
            <div
                className="absolute inset-0 opacity-[0.04]" // very subtle dark lines
                style={{
                    backgroundImage: `
              linear-gradient(to right, #000000 1px, transparent 1px),
              linear-gradient(to bottom, #000000 1px, transparent 1px)
            `,
                    backgroundSize: "64px 64px",
                }}
            />
        </div>
    );
};

export default LightBackground;
