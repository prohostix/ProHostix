'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Briefcase,
    FileText,
    CheckCircle2,
    Download,
    ExternalLink,
    Sparkles,
    Eye,
    EyeOff,
    Clock,
    AlertTriangle,
    HelpCircle,
    Loader2,
    Building2,
    Calendar,
    Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function CareerApplicationPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [evaluating, setEvaluating] = useState<boolean>(false);
    const [showCVPreview, setShowCVPreview] = useState<boolean>(true);
    const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;
        const fetchApplication = async () => {
            try {
                setLoading(true);
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
                const res = await fetch(`/api/enquiries/careers/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (!res.ok) {
                    throw new Error('Application not found');
                }
                const data = await res.json();
                setApplication(data);
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || 'Failed to load application');
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        try {
            setUpdatingStatus(true);
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
            const res = await fetch(`/api/enquiries/careers/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error('Failed to update status');
            const updated = await res.json();
            setApplication(updated);
            toast.success(`Application marked as ${newStatus}`);
        } catch (err: any) {
            toast.error(err.message || 'Update failed');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleRunAIEvaluation = async () => {
        try {
            setEvaluating(true);
            const res = await fetch('/api/candidates/evaluate-application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: id })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Evaluation failed');
            toast.success(`AI Evaluation complete! Fit Score: ${data.aiScore}%`);
            setApplication((prev: any) => ({
                ...prev,
                aiScore: data.aiScore,
                aiStatus: data.aiStatus,
                aiEvaluation: data.evaluation
            }));
        } catch (err: any) {
            toast.error(err.message || 'AI Evaluation failed');
        } finally {
            setEvaluating(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 size={32} className="animate-spin text-emerald-400" />
                        <span className="text-xs text-zinc-400">Loading candidate application record...</span>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!application) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-6">
                    <div className="text-center max-w-sm space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
                            <AlertTriangle size={28} />
                        </div>
                        <h2 className="text-xl font-bold">Application Record Not Found</h2>
                        <p className="text-xs text-zinc-400">The application may have been removed or the ID is invalid.</p>
                        <Link
                            href="/admin/dashboard?tab=enquiries"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10"
                        >
                            <ArrowLeft size={14} /> Back to Dashboard
                        </Link>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const resumeViewUrl = `/api/enquiries/careers/${id}/resume`;
    const resumeDownloadUrl = `/api/enquiries/careers/${id}/resume?download=1`;

    const details = [
        { label: 'Full Name', value: application.name, icon: User },
        { label: 'Work Email', value: application.email, icon: Mail },
        { label: 'Target Position', value: application.role, icon: Briefcase },
        { label: 'Phone Number', value: `${application.countryCode || ''} ${application.phoneNumber || 'N/A'}`.trim(), icon: Phone },
        { label: 'Location', value: application.country || 'N/A', icon: CheckCircle2 },
        { label: 'Submission Date', value: new Date(application.createdAt).toLocaleString(), icon: Calendar },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-10">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Top Navigation Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                        <Link
                            href="/admin/dashboard?tab=enquiries"
                            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Leads & Job Applications
                        </Link>

                        <div className="flex items-center gap-3">
                            <span className="text-xs text-zinc-400">Status:</span>
                            <select
                                value={application.status || 'received'}
                                disabled={updatingStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                            >
                                <option value="received">Received</option>
                                <option value="reviewing">Under Review</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            <a
                                href={`mailto:${application.email}`}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
                            >
                                <Mail size={14} /> Contact
                            </a>
                        </div>
                    </div>

                    {/* Applicant Profile Hero Card */}
                    <div className="p-6 lg:p-8 rounded-3xl bg-[#0d0d0d] border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                                    {application.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-2xl font-bold text-white">{application.name}</h1>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                            application.status === 'shortlisted'
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                : application.status === 'rejected'
                                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                        }`}>
                                            {application.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-400 font-medium">
                                        Applied for <span className="text-white font-semibold">{application.role}</span>
                                    </p>
                                </div>
                            </div>

                            {/* AI Match Fit Badge */}
                            <div className="flex items-center gap-4">
                                {application.aiScore ? (
                                    <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-[10px] uppercase font-bold text-zinc-400">AI Match Fit</div>
                                            <div className="text-2xl font-black text-emerald-400">{application.aiScore}%</div>
                                        </div>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                                            application.aiStatus === 'SHORTLISTED'
                                                ? 'bg-emerald-500/20 text-emerald-300'
                                                : 'bg-amber-500/20 text-amber-300'
                                        }`}>
                                            <Sparkles size={18} />
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleRunAIEvaluation}
                                        disabled={evaluating}
                                        className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        <Sparkles size={14} className={evaluating ? 'animate-spin' : ''} />
                                        {evaluating ? 'Analyzing CV...' : 'Run AI Evaluation'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-white/5">
                            {details.map((d, idx) => (
                                <div key={idx} className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                                        <d.icon size={12} />
                                        {d.label}
                                    </label>
                                    <p className="text-xs font-semibold text-zinc-200">{d.value || '—'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Candidate Message */}
                    <div className="p-6 rounded-3xl bg-[#0d0d0d] border border-white/10 space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                            <FileText size={14} className="text-blue-400" />
                            Candidate Cover Note
                        </label>
                        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 text-sm text-zinc-300 leading-relaxed italic">
                            "{application.message || 'No additional message provided.'}"
                        </div>
                    </div>

                    {/* Dedicated Resume / CV Viewing Section */}
                    <div className="p-6 lg:p-8 rounded-3xl bg-[#0d0d0d] border border-white/10 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FileText size={18} className="text-blue-400" />
                                    Candidate Resume / Curriculum Vitae
                                </h3>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    {application.resumeOriginalName || 'Resume.pdf'}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <a
                                    href={resumeViewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
                                >
                                    <ExternalLink size={14} />
                                    Open Fullscreen in New Tab
                                </a>
                                <a
                                    href={resumeDownloadUrl}
                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all"
                                >
                                    <Download size={14} />
                                    Download CV
                                </a>
                                <button
                                    onClick={() => setShowCVPreview(!showCVPreview)}
                                    className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-2 transition-all"
                                >
                                    {showCVPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                                    {showCVPreview ? 'Hide Inline Preview' : 'Show Inline Preview'}
                                </button>
                            </div>
                        </div>

                        {/* Embedded CV Document Viewer */}
                        {showCVPreview && (
                            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/80 h-[700px] shadow-2xl">
                                <iframe
                                    src={resumeViewUrl}
                                    title="Candidate Resume"
                                    className="w-full h-full border-0"
                                />
                            </div>
                        )}
                    </div>

                    {/* AI Evaluation Deep Dive */}
                    {application.aiEvaluation && (
                        <div className="p-6 lg:p-8 rounded-3xl bg-[#0d0d0d] border border-white/10 space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                                    <Sparkles size={18} />
                                    <span>AI Technical Screening Insights</span>
                                </div>
                                <button
                                    onClick={handleRunAIEvaluation}
                                    disabled={evaluating}
                                    className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                                >
                                    <Sparkles size={12} />
                                    Re-Run AI
                                </button>
                            </div>

                            {/* Summary */}
                            {application.aiEvaluation.aiSummary && (
                                <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 text-sm text-zinc-300 leading-relaxed italic">
                                    "{application.aiEvaluation.aiSummary}"
                                </div>
                            )}

                            {/* Strengths & Gaps */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {application.aiEvaluation.strengths && (
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                                            <CheckCircle2 size={13} /> Verified Strengths
                                        </label>
                                        <ul className="space-y-2">
                                            {application.aiEvaluation.strengths.map((s: string, idx: number) => (
                                                <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                                                    <span className="text-emerald-400 font-bold">✓</span>
                                                    <span>{s}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {application.aiEvaluation.weaknesses && (
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                            <AlertTriangle size={13} /> Areas to Probe / Gaps
                                        </label>
                                        <ul className="space-y-2">
                                            {application.aiEvaluation.weaknesses.map((w: string, idx: number) => (
                                                <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                                                    <span className="text-amber-400 font-bold">⚠</span>
                                                    <span>{w}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Interview Questions */}
                            {application.aiEvaluation.interviewQuestions && (
                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                                        <HelpCircle size={13} /> Suggested Technical Interview Questions
                                    </label>
                                    <div className="space-y-2.5">
                                        {application.aiEvaluation.interviewQuestions.map((q: string, idx: number) => (
                                            <div key={idx} className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 text-xs text-zinc-300 leading-relaxed">
                                                <span className="font-bold text-blue-400 mr-2">Question {idx + 1}:</span>
                                                {q}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
