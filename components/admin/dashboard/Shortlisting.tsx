'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Upload,
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    Search,
    Filter,
    Plus,
    RefreshCw,
    Download,
    ExternalLink,
    ChevronRight,
    Briefcase,
    Building2,
    Calendar,
    Award,
    AlertTriangle,
    Eye,
    EyeOff,
    Trash2,
    FolderArchive,
    Loader2,
    Check,
    HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Candidate {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    jobId: string;
    jobTitle: string;
    resumeFileName: string;
    resumeFileType: string;
    resumeFileSize: number;
    resumeFileBase64?: string;
    skills: string[];
    experienceYears: number;
    currentRole?: string;
    currentCompany?: string;
    education?: { degree: string; school: string; year?: string }[];
    workHistory?: { company: string; role: string; duration?: string }[];
    aiScore: number;
    aiStatus: 'SHORTLISTED' | 'REVIEW' | 'REJECTED';
    skillsMatchScore: number;
    experienceMatchScore: number;
    educationMatchScore: number;
    aiSummary: string;
    strengths: string[];
    weaknesses: string[];
    interviewQuestions: string[];
    pipelineStatus: string;
    recruiterNotes?: string;
    source?: string;
    createdAt: string;
}

interface JobRequisition {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    minYears: number;
    requiredSkills: string[];
    preferredSkills: string[];
    description: string;
    status: string;
}

export default function Shortlisting() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [jobs, setJobs] = useState<JobRequisition[]>([]);
    const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const [stats, setStats] = useState({
        total: 0,
        shortlisted: 0,
        review: 0,
        rejected: 0,
        averageScore: 0,
    });

    // Detail Drawer Modal
    const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
    const [candidateNotes, setCandidateNotes] = useState<string>('');
    const [showCVPreview, setShowCVPreview] = useState<boolean>(false);
    const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

    // Bulk Upload Modal
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const [targetJobId, setTargetJobId] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create Job Modal
    const [showCreateJobModal, setShowCreateJobModal] = useState<boolean>(false);
    const [newJob, setNewJob] = useState({
        title: '',
        department: 'Engineering',
        minYears: 3,
        requiredSkills: '',
        preferredSkills: '',
        description: '',
    });

    // Fetch Jobs & Candidates
    const fetchData = async () => {
        try {
            setLoading(true);
            const [jobsRes, candidatesRes] = await Promise.all([
                fetch('/api/jobs'),
                fetch(`/api/candidates?jobId=${selectedJobId}&status=${selectedStatus}&search=${encodeURIComponent(searchQuery)}`)
            ]);

            const jobsData = await jobsRes.json();
            const candData = await candidatesRes.json();

            if (Array.isArray(jobsData)) {
                setJobs(jobsData);
                if (!targetJobId && jobsData.length > 0) {
                    setTargetJobId(jobsData[0]._id);
                }
            }

            if (candData.candidates) {
                setCandidates(candData.candidates);
                setStats(candData.stats || {
                    total: 0,
                    shortlisted: 0,
                    review: 0,
                    rejected: 0,
                    averageScore: 0
                });
            }
        } catch (error) {
            console.error('Failed to load shortlisting data:', error);
            toast.error('Failed to fetch shortlisting data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedJobId, selectedStatus]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData();
    };

    // Open candidate details
    const openCandidateDetails = (candidate: Candidate) => {
        setActiveCandidate(candidate);
        setCandidateNotes(candidate.recruiterNotes || '');
        setShowCVPreview(false);
    };

    // Update candidate pipeline status
    const updatePipelineStatus = async (id: string, newStatus: string) => {
        try {
            setUpdatingStatus(true);
            const res = await fetch(`/api/candidates/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pipelineStatus: newStatus, recruiterNotes: candidateNotes })
            });
            if (!res.ok) throw new Error('Update failed');
            const updated = await res.json();
            setCandidates(prev => prev.map(c => c._id === id ? { ...c, pipelineStatus: newStatus, recruiterNotes: candidateNotes } : c));
            if (activeCandidate && activeCandidate._id === id) {
                setActiveCandidate(prev => prev ? { ...prev, pipelineStatus: newStatus, recruiterNotes: candidateNotes } : null);
            }
            toast.success(`Pipeline status updated to ${newStatus}`);
        } catch (err: any) {
            toast.error(err.message || 'Failed to update candidate');
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Delete candidate
    const handleDeleteCandidate = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this candidate evaluation?')) return;
        try {
            const res = await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            setCandidates(prev => prev.filter(c => c._id !== id));
            if (activeCandidate && activeCandidate._id === id) {
                setActiveCandidate(null);
            }
            toast.success('Candidate deleted');
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete');
        }
    };

    // Handle File Drop or Selection for Bulk Upload
    const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setUploadFiles(prev => [...prev, ...newFiles]);
        }
    };

    // Perform Bulk CV Upload & AI Evaluation
    const handleBulkUpload = async () => {
        if (uploadFiles.length === 0) {
            toast.error('Please select at least one CV or ZIP file');
            return;
        }

        try {
            setUploading(true);
            setUploadProgress(`Uploading ${uploadFiles.length} file(s) and running AI evaluations...`);

            const formData = new FormData();
            formData.append('jobId', targetJobId || (jobs[0]?._id ?? ''));
            uploadFiles.forEach(file => {
                formData.append('files', file);
            });

            const res = await fetch('/api/candidates', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to process files');

            toast.success(`Successfully analyzed and parsed ${data.count} candidate(s)!`);
            setUploadFiles([]);
            setShowUploadModal(false);
            fetchData();
        } catch (err: any) {
            toast.error(err.message || 'Bulk upload failed');
        } finally {
            setUploading(false);
            setUploadProgress('');
        }
    };

    // Create Job Requisition
    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newJob)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create job');
            toast.success(`Created job requisition: ${data.title}`);
            setShowCreateJobModal(false);
            setNewJob({
                title: '',
                department: 'Engineering',
                minYears: 3,
                requiredSkills: '',
                preferredSkills: '',
                description: '',
            });
            fetchData();
        } catch (err: any) {
            toast.error(err.message || 'Failed to create job requisition');
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-16">
            {/* Top Banner / Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                        <Sparkles size={13} />
                        <span>Prohostix TalentAI Engine</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                        AI CV Shortlisting & Candidate Evaluation
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1">
                        Automated multi-factor candidate screening, gap analysis, and JD match scoring powered by Gemini 2.5
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowCreateJobModal(true)}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 flex items-center gap-2 transition-all"
                    >
                        <Plus size={15} />
                        New Job Role
                    </button>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                        <Upload size={15} />
                        Bulk Upload CVs
                    </button>
                    <button
                        onClick={fetchData}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all"
                        title="Refresh candidates"
                    >
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-4 rounded-2xl bg-[#0c0c0c] border border-white/5 flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Total Evaluated</span>
                    <span className="text-2xl font-black text-white">{stats.total}</span>
                    <span className="text-[10px] text-zinc-400">Processed Resumes</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> Shortlisted
                    </span>
                    <span className="text-2xl font-black text-emerald-300">{stats.shortlisted}</span>
                    <span className="text-[10px] text-emerald-400/80">≥ 78% Match Fit</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Clock size={13} /> Under Review
                    </span>
                    <span className="text-2xl font-black text-amber-300">{stats.review}</span>
                    <span className="text-[10px] text-amber-400/80">58% - 77% Fit</span>
                </div>
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <XCircle size={13} /> Low Fit / Rejected
                    </span>
                    <span className="text-2xl font-black text-rose-300">{stats.rejected}</span>
                    <span className="text-[10px] text-rose-400/80">&lt; 58% Fit</span>
                </div>
                <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 flex flex-col gap-1 col-span-2 sm:col-span-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <Award size={13} /> Avg Match Score
                    </span>
                    <span className="text-2xl font-black text-blue-300">{stats.averageScore}%</span>
                    <span className="text-[10px] text-blue-400/80">Overall Talent Pool</span>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Job Filter */}
                    <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-zinc-400 shrink-0" />
                        <select
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                            className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 font-medium"
                        >
                            <option value="ALL">All Requisitions ({jobs.length})</option>
                            {jobs.map((j) => (
                                <option key={j._id} value={j._id}>
                                    {j.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Tabs */}
                    <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/5">
                        {['ALL', 'SHORTLISTED', 'REVIEW', 'REJECTED'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setSelectedStatus(st)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    selectedStatus === st
                                        ? 'bg-emerald-500 text-black font-bold shadow-sm'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                {st === 'ALL' ? 'All' : st === 'SHORTLISTED' ? 'Shortlisted' : st === 'REVIEW' ? 'Review' : 'Rejected'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearch} className="relative min-w-[240px]">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search candidate name, skill..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                </form>
            </div>

            {/* Candidates List / Table */}
            <div className="bg-[#080808] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                            <tr>
                                <th className="px-6 py-4">Candidate Profile</th>
                                <th className="px-6 py-4">Target Role</th>
                                <th className="px-6 py-4">AI Fit Score</th>
                                <th className="px-6 py-4">Top Skills</th>
                                <th className="px-6 py-4">Pipeline Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                                        <Loader2 size={24} className="animate-spin mx-auto mb-2 text-emerald-400" />
                                        <span>Evaluating & loading candidate registry...</span>
                                    </td>
                                </tr>
                            ) : candidates.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                                        <Briefcase size={28} className="mx-auto mb-2 text-zinc-600 opacity-60" />
                                        <p className="text-zinc-300 font-semibold mb-1">No candidates match your filters</p>
                                        <p className="text-xs text-zinc-500 mb-4">Upload resumes or adjust your search criteria</p>
                                        <button
                                            onClick={() => setShowUploadModal(true)}
                                            className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold inline-flex items-center gap-2"
                                        >
                                            <Upload size={14} /> Upload Resumes Now
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                candidates.map((cand) => (
                                    <tr
                                        key={cand._id}
                                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                        onClick={() => openCandidateDetails(cand)}
                                    >
                                        {/* Candidate Identity */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center font-bold text-white text-xs shrink-0">
                                                    {cand.fullName.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                                                        <span>{cand.fullName}</span>
                                                        {cand.source && (
                                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 text-zinc-400 border border-white/5">
                                                                {cand.source}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[11px] text-zinc-500 truncate">{cand.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Target Role */}
                                        <td className="px-6 py-4">
                                            <div className="text-zinc-300 font-medium truncate max-w-[180px]">{cand.jobTitle}</div>
                                            <div className="text-[10px] text-zinc-500">{cand.experienceYears} Years Exp</div>
                                        </td>

                                        {/* AI Fit Score */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wide border flex items-center gap-1.5 ${
                                                    cand.aiStatus === 'SHORTLISTED'
                                                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                                        : cand.aiStatus === 'REVIEW'
                                                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                                }`}>
                                                    <Sparkles size={11} />
                                                    <span>{cand.aiScore}%</span>
                                                </div>
                                                <span className="text-[10px] uppercase font-bold text-zinc-500">
                                                    {cand.aiStatus}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Top Skills */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-[240px]">
                                                {cand.skills.slice(0, 3).map((sk, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 border border-white/5 text-[10px]">
                                                        {sk}
                                                    </span>
                                                ))}
                                                {cand.skills.length > 3 && (
                                                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-zinc-500 text-[10px]">
                                                        +{cand.skills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Pipeline Status */}
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={cand.pipelineStatus || 'Applied'}
                                                onChange={(e) => updatePipelineStatus(cand._id, e.target.value)}
                                                className="bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-zinc-200 focus:outline-none focus:border-emerald-500"
                                            >
                                                <option value="Applied">Applied</option>
                                                <option value="AI Shortlisted">AI Shortlisted</option>
                                                <option value="Screening">Screening</option>
                                                <option value="Technical Round">Technical Round</option>
                                                <option value="Executive Interview">Executive Interview</option>
                                                <option value="Offered">Offered</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-1.5">
                                                <a
                                                    href={`/api/candidates/${cand._id}/download`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg text-blue-400 hover:text-white hover:bg-blue-500/20 transition-colors"
                                                    title="View / Stream CV"
                                                >
                                                    <FileText size={15} />
                                                </a>
                                                <button
                                                    onClick={() => openCandidateDetails(cand)}
                                                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                                    title="View Full Evaluation"
                                                >
                                                    <Eye size={15} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCandidate(cand._id)}
                                                    className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Candidate Detail Drawer / Modal */}
            <AnimatePresence>
                {activeCandidate && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveCandidate(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-2xl h-full bg-[#0d0d0d] border-l border-white/10 p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between shadow-2xl z-10"
                        >
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex items-start justify-between border-b border-white/5 pb-5">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                activeCandidate.aiStatus === 'SHORTLISTED'
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    : activeCandidate.aiStatus === 'REVIEW'
                                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                            }`}>
                                                {activeCandidate.aiStatus}
                                            </span>
                                            <span className="text-xs text-zinc-400 font-mono">
                                                Match: {activeCandidate.aiScore}%
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{activeCandidate.fullName}</h3>
                                        <p className="text-xs text-zinc-400">{activeCandidate.email} • {activeCandidate.phone}</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveCandidate(null)}
                                        className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>

                                {/* Score Gauges */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                                        <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Skills Match</div>
                                        <div className="text-lg font-black text-emerald-400">{activeCandidate.skillsMatchScore}%</div>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                                        <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Experience</div>
                                        <div className="text-lg font-black text-blue-400">{activeCandidate.experienceMatchScore}%</div>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                                        <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Education</div>
                                        <div className="text-lg font-black text-purple-400">{activeCandidate.educationMatchScore}%</div>
                                    </div>
                                </div>

                                {/* Executive Summary */}
                                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                                        <Sparkles size={12} /> AI Recruiter Synthesis
                                    </label>
                                    <p className="text-xs text-zinc-300 leading-relaxed italic">
                                        "{activeCandidate.aiSummary || 'Evaluated against job specifications.'}"
                                    </p>
                                </div>

                                {/* Candidate CV Actions & Preview */}
                                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-blue-400" />
                                            <span className="text-xs font-semibold text-white">{activeCandidate.resumeFileName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`/api/candidates/${activeCandidate._id}/download`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                                            >
                                                <ExternalLink size={12} /> Open Full CV
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => setShowCVPreview(!showCVPreview)}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                                            >
                                                {showCVPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                                                {showCVPreview ? 'Hide' : 'Preview'}
                                            </button>
                                        </div>
                                    </div>

                                    {showCVPreview && (
                                        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/80 h-80">
                                            <iframe
                                                src={`/api/candidates/${activeCandidate._id}/download`}
                                                title="Resume Stream"
                                                className="w-full h-full border-0"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Strengths */}
                                {activeCandidate.strengths && activeCandidate.strengths.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                                            <CheckCircle2 size={12} /> Verified Strengths
                                        </label>
                                        <ul className="space-y-1.5">
                                            {activeCandidate.strengths.map((str, idx) => (
                                                <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                                                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                                    <span>{str}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Weaknesses / Gaps */}
                                {activeCandidate.weaknesses && activeCandidate.weaknesses.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                                            <AlertTriangle size={12} /> Potential Gaps / Watchpoints
                                        </label>
                                        <ul className="space-y-1.5">
                                            {activeCandidate.weaknesses.map((w, idx) => (
                                                <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                                                    <span className="text-amber-400 font-bold shrink-0">⚠</span>
                                                    <span>{w}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Recommended Interview Questions */}
                                {activeCandidate.interviewQuestions && activeCandidate.interviewQuestions.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
                                            <HelpCircle size={12} /> Tailored Interview Questions
                                        </label>
                                        <div className="space-y-2">
                                            {activeCandidate.interviewQuestions.map((q, idx) => (
                                                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-300 leading-relaxed">
                                                    <span className="font-bold text-blue-400 mr-1.5">Q{idx + 1}:</span>
                                                    {q}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recruiter Notes */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                        Recruiter Internal Notes
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={candidateNotes}
                                        onChange={(e) => setCandidateNotes(e.target.value)}
                                        placeholder="Add private evaluation notes, interview feedback..."
                                        className="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Drawer Footer Actions */}
                            <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-3 mt-6">
                                <button
                                    onClick={() => updatePipelineStatus(activeCandidate._id, 'Rejected')}
                                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all"
                                >
                                    Reject
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updatePipelineStatus(activeCandidate._id, 'Technical Round')}
                                        className="px-4 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all"
                                    >
                                        Schedule Interview
                                    </button>
                                    <button
                                        onClick={() => updatePipelineStatus(activeCandidate._id, 'AI Shortlisted')}
                                        className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all"
                                    >
                                        Shortlist Candidate
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Bulk Upload Modal (Supports Multiple Resumes & ZIP Files) */}
            <AnimatePresence>
                {showUploadModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !uploading && setShowUploadModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6"
                        >
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                        <Upload size={18} className="text-emerald-400" />
                                        Bulk CV Upload & AI Screener
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        Select multiple PDF / DOCX resumes or drop a ZIP archive for batch evaluation
                                    </p>
                                </div>
                                {!uploading && (
                                    <button
                                        onClick={() => setShowUploadModal(false)}
                                        className="p-1.5 text-zinc-500 hover:text-white"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Job Target Selection */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                                    Target Job Requisition
                                </label>
                                <select
                                    value={targetJobId}
                                    onChange={(e) => setTargetJobId(e.target.value)}
                                    className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                >
                                    {jobs.map((j) => (
                                        <option key={j._id} value={j._id}>
                                            {j.title} ({j.department})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Drop Zone */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/15 hover:border-emerald-500/50 bg-white/[0.01] hover:bg-emerald-500/[0.02] rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".pdf,.docx,.txt,.zip"
                                    onChange={handleFileSelection}
                                    className="hidden"
                                />
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                                    <FolderArchive size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Click or drag & drop candidate files here</p>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        Supports individual .PDF, .DOCX, .TXT, or .ZIP archive containing multiple CVs
                                    </p>
                                </div>
                            </div>

                            {/* Selected Files List */}
                            {uploadFiles.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-zinc-400">
                                        <span>Selected Files ({uploadFiles.length}):</span>
                                        <button
                                            type="button"
                                            onClick={() => setUploadFiles([])}
                                            className="text-rose-400 hover:underline text-[11px]"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                                        {uploadFiles.map((file, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/60 border border-white/5 text-xs"
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileText size={14} className="text-emerald-400 shrink-0" />
                                                    <span className="text-zinc-200 truncate">{file.name}</span>
                                                </div>
                                                <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload Progress Indicator */}
                            {uploading && (
                                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-300">
                                    <Loader2 size={16} className="animate-spin text-emerald-400 shrink-0" />
                                    <span>{uploadProgress}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    disabled={uploading}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleBulkUpload}
                                    disabled={uploading || uploadFiles.length === 0}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Evaluating Resumes...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={14} />
                                            Start AI Analysis ({uploadFiles.length})
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create Job Requisition Modal */}
            <AnimatePresence>
                {showCreateJobModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateJobModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h3 className="font-bold text-lg text-white">Create New Job Role</h3>
                                <button onClick={() => setShowCreateJobModal(false)} className="text-zinc-500 hover:text-white">
                                    <XCircle size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
                                <div>
                                    <label className="font-semibold text-zinc-400 block mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Senior Backend Engineer"
                                        value={newJob.title}
                                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                        className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="font-semibold text-zinc-400 block mb-1">Department</label>
                                        <input
                                            type="text"
                                            value={newJob.department}
                                            onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                                            className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-semibold text-zinc-400 block mb-1">Min Experience (Years)</label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={25}
                                            value={newJob.minYears}
                                            onChange={(e) => setNewJob({ ...newJob, minYears: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="font-semibold text-zinc-400 block mb-1">Required Skills (Comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="Node.js, TypeScript, PostgreSQL, Docker"
                                        value={newJob.requiredSkills}
                                        onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                                        className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold text-zinc-400 block mb-1">Description & Key Responsibilities</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Responsibilities, stack details, project scope..."
                                        value={newJob.description}
                                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                        className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateJobModal(false)}
                                        className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                                    >
                                        Create Role
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

