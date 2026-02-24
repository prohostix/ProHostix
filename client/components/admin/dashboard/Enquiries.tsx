'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Briefcase, Zap, Search, Trash2, Eye, RefreshCcw } from 'lucide-react';
import { countries } from '@/config/countries';
import ProjectDetailsModal from './ProjectDetailsModal';
import JobApplicationModal from './JobApplicationModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import api from '@/utils/api';
import { useEnquiries } from '@/hooks/usePageData';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface EnquiriesProps {
    initialTab?: string;
    searchQuery?: string;
}

const Enquiries: React.FC<EnquiriesProps> = ({ initialTab, searchQuery = '' }) => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState(initialTab || 'projects');
    const { data = [], isLoading, isFetching, refetch } = useEnquiries(activeTab);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: null as string | null,
        title: '',
        message: ''
    });

    // Sync state with prop if it changes
    React.useEffect(() => {
        if (initialTab && initialTab !== activeTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    const requestDelete = (id: string) => {
        let type = 'Record';
        if (activeTab === 'projects') type = 'Enquiry';
        if (activeTab === 'careers') type = 'Job Application';
        if (activeTab === 'subscribers') type = 'Subscriber';

        setConfirmModal({
            isOpen: true,
            id,
            title: `Delete ${type}?`,
            message: `Are you sure you want to permanently remove this ${type.toLowerCase()}? This action cannot be undone.`
        });
    };

    const handleConfirmDelete = async () => {
        if (!confirmModal.id) return;

        const toastId = toast.loading('Deleting record...');

        try {
            let endpoint = '/enquiries';
            if (activeTab === 'careers') endpoint = '/enquiries/careers';
            if (activeTab === 'subscribers') endpoint = '/enquiries/subscribe';

            await api.delete(`${endpoint}/${confirmModal.id}`);

            toast.success('Record deleted successfully', { id: toastId });

            queryClient.invalidateQueries({ queryKey: ['enquiries', activeTab] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete record', { id: toastId });
        }
    };

    const tabs = [
        { id: 'projects', label: 'Project Enquiries', icon: Mail },
        { id: 'careers', label: 'Job Applications', icon: Briefcase },
        { id: 'subscribers', label: 'Newsletter Subscribers', icon: Zap },
    ];

    const filteredData = (data as any[]).filter(item => {
        const combinedSearch = `${searchTerm} ${searchQuery}`.trim().toLowerCase();

        if (!combinedSearch) return true;

        if (activeTab === 'subscribers') {
            return item.email?.toLowerCase().includes(combinedSearch);
        }
        return (
            item.name?.toLowerCase().includes(combinedSearch) ||
            item.email?.toLowerCase().includes(combinedSearch) ||
            item.company?.toLowerCase().includes(combinedSearch) ||
            item.firstName?.toLowerCase().includes(combinedSearch) ||
            item.lastName?.toLowerCase().includes(combinedSearch) ||
            item.role?.toLowerCase().includes(combinedSearch)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex bg-[#0f0f0f] p-1 rounded-xl border border-[#222222] w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-[#1c1c1c] text-white'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            <tab.icon size={15} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="p-1.5 bg-[#0f0f0f] border border-[#222222] rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50"
                        title="Force Refresh Data"
                    >
                        <RefreshCcw size={16} className={isFetching ? 'animate-spin' : ''} />
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                        <input
                            type="text"
                            placeholder="search records..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#0f0f0f] border border-[#222222] rounded-lg pl-9 pr-4 py-1.5 text-[13px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#333333] w-full md:w-64 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-[#0f0f0f] border border-[#222222] rounded-xl overflow-hidden relative">
                    <div className="overflow-x-auto max-h-[70vh]">
                        <table className="w-full text-left text-[13px] text-zinc-400 table-fixed min-w-[1000px]">
                            <thead className="bg-[#141414] text-zinc-500 font-medium capitalize text-xs tracking-tight border-b border-[#222222] sticky top-0 z-10">
                                <tr>
                                    {activeTab === 'projects' && (
                                        <>
                                            <th className="px-5 py-3 w-[26%] font-medium">Client</th>
                                            <th className="px-5 py-3 w-[20%] font-medium">Company</th>
                                            <th className="px-5 py-3 w-[16%] font-medium">Enquiry Type</th>
                                            <th className="px-5 py-3 w-[18%] font-medium">Message Preview</th>
                                            <th className="px-5 py-3 w-[12%] font-medium text-right">Date</th>
                                            <th className="px-5 py-3 w-[8%] font-medium text-right">Actions</th>
                                        </>
                                    )}
                                    {activeTab === 'careers' && (
                                        <>
                                            <th className="px-5 py-3 w-[26%] font-medium">Candidate</th>
                                            <th className="px-5 py-3 w-[20%] font-medium">Role</th>
                                            <th className="px-5 py-3 w-[16%] font-medium">Location</th>
                                            <th className="px-5 py-3 w-[18%] font-medium">Message Preview</th>
                                            <th className="px-5 py-3 w-[12%] font-medium text-right">Date</th>
                                            <th className="px-5 py-3 w-[8%] font-medium text-right">Actions</th>
                                        </>
                                    )}
                                    {activeTab === 'subscribers' && (
                                        <>
                                            <th className="px-5 py-3 w-[70%] font-medium">Email Address</th>
                                            <th className="px-5 py-3 w-[20%] font-medium text-right">Subscribed Date</th>
                                            <th className="px-5 py-3 w-[10%] font-medium text-right">Actions</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#222222]">
                                {filteredData.length > 0 ? filteredData.map((item, i) => (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0, x: -4 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2, delay: i * 0.03 }}
                                        className="hover:bg-[#141414] transition-colors group"
                                    >
                                        {activeTab === 'projects' && (
                                            <>
                                                <td className="px-5 py-3">
                                                    <div
                                                        className="flex items-center gap-3 cursor-pointer"
                                                        onClick={() => setSelectedEnquiry(item)}
                                                    >
                                                        <div className="w-8 h-8 rounded bg-[#1c1c1c] flex items-center justify-center text-zinc-300 font-semibold text-xs border border-[#2a2a2a] shrink-0">
                                                            {item.name?.charAt(0) || '?'}
                                                        </div>
                                                        <div className="min-w-0 flex flex-col gap-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">{item.name || 'Unknown'}</span>
                                                                {item.country && (
                                                                    <span title={item.country} className="text-xs shrink-0 opacity-70">
                                                                        {(countries as any[]).find(c => c.name === item.country)?.flag || '📍'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-[11px] text-zinc-500 font-medium truncate">{item.email || 'No email provided'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-zinc-300 font-medium truncate max-w-[160px]">{item.company || '—'}</span>
                                                        <span className="text-[11px] text-zinc-500 truncate">{item.countryCode ? `${item.countryCode} ` : ''}{item.phoneNumber || '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className="text-[11px] font-semibold text-zinc-300 bg-[#1c1c1c] px-2 py-0.5 rounded truncate inline-block max-w-full border border-[#2a2a2a]">
                                                        {item.enquiryType || 'General'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 align-middle">
                                                    <p
                                                        className="text-xs text-zinc-500 line-clamp-1 cursor-pointer pr-2 hover:text-zinc-300 transition-colors h-[16px]"
                                                        title={item.description}
                                                        onClick={() => setSelectedEnquiry(item)}
                                                    >
                                                        {item.description || '—'}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-3 align-middle text-right">
                                                    <span className="text-xs text-zinc-500 font-medium">{item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                                                </td>
                                                <td className="px-5 py-3 align-middle">
                                                    <div className="flex justify-end gap-1 opacity-30 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => setSelectedEnquiry(item)}
                                                            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => requestDelete(item._id)}
                                                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                            title="Delete Record"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'careers' && (
                                            <>
                                                <td className="px-5 py-3">
                                                    <div
                                                        className="flex items-center gap-3 cursor-pointer"
                                                        onClick={() => setSelectedEnquiry(item)}
                                                    >
                                                        <div className="w-8 h-8 rounded bg-[#1c1c1c] flex items-center justify-center text-zinc-300 font-semibold text-xs border border-[#2a2a2a] shrink-0">
                                                            {(item.name || item.firstName || '?').charAt(0)}
                                                        </div>
                                                        <div className="min-w-0 flex flex-col gap-0.5">
                                                            <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">{item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Unknown'}</span>
                                                            <span className="text-[11px] text-zinc-500 font-medium truncate">{item.email || 'No email provided'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-zinc-300 font-medium truncate max-w-[160px] cursor-pointer" onClick={() => setSelectedEnquiry(item)}>{item.role || '—'}</span>
                                                        <span className="text-[11px] text-zinc-500 truncate">{item.countryCode ? `${item.countryCode} ` : ''}{item.phoneNumber || '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2 text-zinc-300 font-medium text-xs truncate">
                                                        {item.country && (
                                                            <span title={item.country} className="shrink-0 opacity-80">
                                                                {(countries as any[]).find(c => c.name === item.country)?.flag || '📍'}
                                                            </span>
                                                        )}
                                                        <span className="truncate">{item.country || '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 align-middle">
                                                    <p
                                                        className="text-xs text-zinc-500 line-clamp-1 cursor-pointer pr-2 hover:text-zinc-300 transition-colors h-[16px]"
                                                        title={item.message}
                                                        onClick={() => setSelectedEnquiry(item)}
                                                    >
                                                        {item.message || '—'}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-3 align-middle text-right">
                                                    <span className="text-xs text-zinc-500 font-medium">{item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                                                </td>
                                                <td className="px-5 py-3 align-middle">
                                                    <div className="flex justify-end gap-1 opacity-30 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => setSelectedEnquiry(item)}
                                                            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                                                        >
                                                            <Eye size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => requestDelete(item._id)}
                                                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'subscribers' && (
                                            <>
                                                <td className="px-5 py-3 text-zinc-200 font-medium truncate">{item.email}</td>
                                                <td className="px-5 py-3 align-middle text-right">
                                                    <span className="text-xs text-zinc-500 font-medium">{item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                                                </td>
                                                <td className="px-5 py-3 align-middle">
                                                    <div className="flex justify-end gap-1 flex-row opacity-30 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => requestDelete(item._id)}
                                                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center">
                                            <p className="text-zinc-500 text-sm font-medium">No records found matching your criteria</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {activeTab === 'careers' ? (
                <JobApplicationModal
                    application={selectedEnquiry}
                    onClose={() => setSelectedEnquiry(null)}
                />
            ) : (
                <ProjectDetailsModal
                    enquiry={selectedEnquiry}
                    onClose={() => setSelectedEnquiry(null)}
                />
            )}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmDelete}
                title={confirmModal.title}
                message={confirmModal.message}
                isDestructive={true}
                confirmText="Delete Permanently"
            />
        </div>
    );
};

export default Enquiries;
