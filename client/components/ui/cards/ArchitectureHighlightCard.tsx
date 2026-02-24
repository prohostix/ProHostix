import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ArchitectureHighlightCardProps {
    value: string;
    label: string;
    icon?: any;
    className?: string;
}

const ArchitectureHighlightCard: React.FC<ArchitectureHighlightCardProps> = ({
    value,
    label,
    icon: IconComponent = CheckCircle2,
    className = ''
}) => {
    return (
        <div className={`relative z-10 flex flex-col items-center text-center max-w-xs group ${className}`}>
            <div className="w-20 h-20 rounded-full bg-zinc-800/80 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 shadow-2xl relative transition-all duration-500 group-hover:border-emerald-500/40 group-hover:bg-zinc-800/90 group-hover:-translate-y-1">
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <IconComponent size={32} className="text-emerald-400 relative z-10" />
            </div>
            <h4 className="text-3xl font-black text-white mb-2 uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                {value}
            </h4>
            <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em]">
                {label}
            </p>
        </div>
    );
};

export default ArchitectureHighlightCard;
