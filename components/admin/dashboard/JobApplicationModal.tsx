'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, User, Mail, Phone, Briefcase, FileText, CheckCircle2, Download, ExternalLink, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface JobApplicationModalProps {
    application: any;
    onClose: () => void;
    onRefresh?: () => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({ application, onClose, onRefresh }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [evaluating, setEvaluating] = useState(false);
    const [currentApp, setCurrentApp] = useState(application);

    useEffect(() => {
        if (application) {
            setCurrentApp(application);
            setShowPreview(false);
        }
    }, [application]);

    const activeApp = currentApp || application;
    if (!activeApp) return null;

    const resumeViewUrl = `/api/enquiries/careers/${activeApp._id}/resume`;
    const resumeDownloadUrl = `/api/enquiries/careers/${activeApp._id}/resume?download=1`;
    const dedicatedPageUrl = `/admin/careers/${activeApp._id}`;

    const handleRunAIEvaluation = async () => {
        try {
            setEvaluating(true);
            const res = await fetch('/api/candidates/evaluate-application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: activeApp._id })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to run AI evaluation');
            toast.success(`AI Evaluation complete! Fit Score: ${data.aiScore}%`);
            setCurrentApp((prev: any) => ({
                ...(prev || activeApp),
                aiScore: data.aiScore,
                aiStatus: data.aiStatus,
                aiEvaluation: data.evaluation
            }));
            if (onRefresh) onRefresh();
        } catch (err: any) {
            toast.error(err.message || 'AI Evaluation failed');
        } finally {
            setEvaluating(false);
        }
    };

    const details = [
        { label: 'Full Name', value: activeApp.name, icon: User, fullWidth: true },
        { label: 'Email', value: activeApp.email, icon: Mail, fullWidth: true },
        { label: 'Role Applied For', value: activeApp.role, icon: Briefcase, fullWidth: true },
        { label: 'Phone Number', value: `${activeApp.countryCode || ''} ${activeApp.phoneNumber || 'N/A'}`.trim(), icon: Phone },
        { label: 'Location', value: activeApp.country || 'N/A', icon: CheckCircle2 },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Job Application Details</h3>
                                <p className="text-xs text-white/40 uppercase tracking-widest">
                                    Received on {new Date(activeApp.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={dedicatedPageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
                                title="Open in Dedicated Application Page"
                            >
                                <ExternalLink size={13} />
                                <span>Dedicated Page</span>
                            </Link>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-grow">
                        {/* Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {details.map((detail: any, i) => (
                                <div key={i} className={`space-y-1.5 ${detail.fullWidth ? 'md:col-span-2' : ''}`}>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                        <detail.icon size={12} />
                                        {detail.label}
                                    </label>
                                    <p className={`text-sm text-white/90 pl-5 ${detail.fullWidth ? 'break-all font-semibold' : ''}`}>
                                        {detail.value || '-'}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Resume / CV Section with Guaranteed Stream & Preview */}
                        <div className="space-y-4 pt-6 border-t border-white/5 bg-white/[0.01] p-4 rounded-xl border">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                                    <FileText size={14} />
                                    Candidate Resume / CV
                                </label>
                                <span className="text-xs text-zinc-400 font-mono">
                                    {activeApp.resumeOriginalName || 'Resume.pdf'}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <a
                                    href={resumeViewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    <ExternalLink size={15} />
                                    Open CV in New Tab
                                </a>

                                <a
                                    href={resumeDownloadUrl}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 rounded-xl text-xs font-semibold transition-all"
                                >
                                    <Download size={15} />
                                    Download CV
                                </a>

                                <button
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold transition-all"
                                >
                                    {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
                                    {showPreview ? 'Hide Preview' : 'Inline Preview'}
                                </button>
                            </div>

                            {/* Inline CV Viewer */}
                            {showPreview && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: '420px' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-inner"
                                >
                                    <iframe
                                        src={resumeViewUrl}
                                        title="Candidate Resume Preview"
                                        className="w-full h-full border-0"
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* AI Shortlisting & Fit Score Section */}
                        <div className="pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                    <Sparkles size={14} />
                                    AI Candidate Evaluation
                                </label>
                                <button
                                    onClick={handleRunAIEvaluation}
                                    disabled={evaluating}
                                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                                >
                                    <Sparkles size={13} className={evaluating ? 'animate-spin' : ''} />
                                    {evaluating ? 'Evaluating...' : (activeApp.aiScore ? 'Re-Evaluate with AI' : 'Run AI Evaluation')}
                                </button>
                            </div>

                            {activeApp.aiScore ? (
                                <div className="p-4 rounded-xl bg-zinc-800/50 border border-white/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black text-white">{activeApp.aiScore}%</span>
                                            <span className="text-xs text-zinc-400">Match Fit</span>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            activeApp.aiStatus === 'SHORTLISTED'
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                                : activeApp.aiStatus === 'REVIEW'
                                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                        }`}>
                                            {activeApp.aiStatus || 'REVIEW'}
                                        </span>
                                    </div>
                                    {activeApp.aiEvaluation?.aiSummary && (
                                        <p className="text-xs text-zinc-300 leading-relaxed italic">
                                            "{activeApp.aiEvaluation.aiSummary}"
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 flex items-center justify-between">
                                    <span>Not evaluated by AI yet. Click "Run AI Evaluation" to screen fit against "{activeApp.role}".</span>
                                </div>
                            )}
                        </div>

                        {/* Candidate Message */}
                        <div className="space-y-3 pt-6 border-t border-white/5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                                <FileText size={12} />
                                Candidate Message
                            </label>
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-white/70 leading-relaxed italic">
                                "{activeApp.message || 'No message provided.'}"
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[10px] text-white/30">
                            <span>Application ID: {activeApp._id}</span>
                            <span>Stored in MongoDB Atlas</span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3 shrink-0">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all text-white"
                        >
                            Close
                        </button>
                        <a
                            href={`mailto:${activeApp.email}`}
                            className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            <Mail size={16} />
                            Contact Candidate
                        </a>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default JobApplicationModal;
