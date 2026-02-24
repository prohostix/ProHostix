
import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Global loading UI for the (site) group.
 * This provides immediate feedback during Next.js route transitions.
 */
export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
            <div className="relative">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-emerald-500/20 blur-[40px] rounded-full animate-pulse" />

                {/* Spinner */}
                <div className="flex flex-col items-center gap-6 relative z-10">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" strokeWidth={1.5} />

                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/80 animate-pulse">
                            Synchronizing
                        </span>
                        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mt-2" />
                    </div>
                </div>
            </div>

            {/* Hidden technical text for aesthetic */}
            <div className="absolute bottom-12 left-12 font-mono text-[8px] text-white/10 uppercase tracking-widest hidden md:block">
                SYS_STATUS: ROUTE_TRANSITION_PENDING<br />
                BUFFERING_LAYER: ARCH_CORE_SYNC
            </div>
        </div>
    );
}
