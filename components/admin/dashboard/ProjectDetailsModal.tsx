'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Building2, Briefcase, FileText, Layers, Sparkles, Clock, MapPin } from 'lucide-react';

interface ProjectDetailsModalProps {
    enquiry: any;
    onClose: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ enquiry, onClose }) => {
    if (!enquiry) return null;

    const identity = [
        { label: 'Full Name', value: enquiry.name, icon: User },
        { label: 'Work Email', value: enquiry.email, icon: Mail },
        { label: 'Company Name', value: enquiry.company, icon: Building2 },
    ];

    const technicalDetails = [
        { label: 'Role', value: enquiry.role, icon: Briefcase },
        { label: 'Timeline', value: enquiry.timeline, icon: Clock },
        { label: 'Interest Category', value: enquiry.enquiryType, icon: Layers },
        { label: 'Specific Item', value: enquiry.enquiryItem, icon: Sparkles },
        { label: 'Country', value: enquiry.country, icon: MapPin },
        { label: 'Phone Number', value: `${enquiry.countryCode || ''} ${enquiry.phoneNumber || 'N/A'}`, icon: Phone },
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
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Enquiry Details</h3>
                                <p className="text-xs text-white/40 uppercase tracking-widest">
                                    Received on {new Date(enquiry.createdAt).toLocaleDateString()}
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
                        {/* Identity Section - Full Width Rows */}
                        <div className="space-y-6">
                            {identity.map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
                                        <item.icon size={12} />
                                        {item.label}
                                    </label>
                                    <p className="text-base text-white font-medium pl-5 break-words leading-tight">
                                        {item.value || '-'}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Technical Grid - 2 Columns */}
                        <div className="pt-6 border-t border-white/5">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-6">Technical & Contextual Info</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                {technicalDetails.map((detail, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
                                            <detail.icon size={12} />
                                            {detail.label}
                                        </label>
                                        <p className="text-sm text-white/80 pl-5 break-words">
                                            {detail.value || '-'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* description / message */}
                        <div className="space-y-3 pt-6 border-t border-white/5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
                                <FileText size={12} />
                                Project Description / Message
                            </label>
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-white/70 leading-relaxed italic">
                                "{enquiry.description}"
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Current Status:</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${enquiry.status === 'new'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : 'bg-white/5 text-white/40 border-white/10'
                                    }`}>
                                    {enquiry.status || 'new'}
                                </span>
                            </div>
                            <div className="text-[10px] text-white/20 italic">
                                ID: {enquiry._id}
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
                            href={`mailto:${enquiry.email}`}
                            className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-semibold transition-all flex items-center gap-2"
                        >
                            <Mail size={16} />
                            Reply via Email
                        </a>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProjectDetailsModal;
