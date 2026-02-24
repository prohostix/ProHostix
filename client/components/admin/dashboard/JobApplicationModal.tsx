'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Briefcase, FileText, CheckCircle2 } from 'lucide-react';

interface JobApplicationModalProps {
    application: any;
    onClose: () => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({ application, onClose }) => {
    if (!application) return null;

    const details = [
        { label: 'Full Name', value: application.name, icon: User, fullWidth: true },
        { label: 'Email', value: application.email, icon: Mail, fullWidth: true },
        { label: 'Role Applied For', value: application.role, icon: Briefcase, fullWidth: true },
        { label: 'Phone Number', value: `${application.countryCode || ''} ${application.phoneNumber || 'N/A'}`.trim(), icon: Phone },
        { label: 'Location', value: application.country || 'N/A', icon: CheckCircle2 },
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
                    className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Job Application Details</h3>
                                <p className="text-xs text-white/40 uppercase tracking-widest">
                                    Received on {new Date(application.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {details.map((detail: any, i) => (
                                <div key={i} className={`space-y-1.5 ${detail.fullWidth ? 'md:col-span-2' : ''}`}>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
                                        <detail.icon size={12} />
                                        {detail.label}
                                    </label>
                                    <p className={`text-sm text-white/80 pl-5 ${detail.fullWidth ? 'break-all' : ''}`}>
                                        {detail.value || '-'}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Resume Link */}
                        {application.resume && (
                            <div className="space-y-3 pt-6 border-t border-white/5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
                                    <FileText size={12} />
                                    Resume / CV
                                </label>
                                <a
                                    href={application.resume.startsWith('http') || application.resume.startsWith('/') ? application.resume : `/${application.resume}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-sm transition-colors"
                                >
                                    <FileText size={16} />
                                    View Resume
                                </a>
                            </div>
                        )}

                        {/* Message */}
                        <div className="space-y-3 pt-6 border-t border-white/5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
                                <FileText size={12} />
                                Candidate Message
                            </label>
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-white/70 leading-relaxed italic">
                                "{application.message || 'No message provided.'}"
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="text-[10px] text-white/20 italic">
                                ID: {application._id}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all"
                        >
                            Close
                        </button>
                        <a
                            href={`mailto:${application.email}`}
                            className="px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-all flex items-center gap-2"
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
