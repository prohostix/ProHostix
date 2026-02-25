
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, X, Globe, Search, RefreshCcw, Save, AlertCircle, Check, Loader2, Link as LinkIcon, Edit2 } from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const Seo = () => {
    const [seoEntries, setSeoEntries] = useState<any[]>([]);
    const [availableRoutes, setAvailableRoutes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        page: '',
        title: '',
        description: '',
        keywords: '',
        ogImage: '',
        robots: 'index, follow',
        canonicalUrl: ''
    });

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        page: null as string | null,
        title: '',
        message: ''
    });

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const [seoRes, routesRes] = await Promise.all([
                api.get('/seo/metadata'),
                api.get('/seo/routes')
            ]);
            setSeoEntries(seoRes as unknown as any[] || []);
            setAvailableRoutes(routesRes as unknown as any[] || []);
        } catch (err) {
            console.error('Failed to load data', err);
            toast.error('Failed to load SEO dashboard');
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    const fetchSeoData = async () => {
        try {
            const res: any = await api.get('/seo/metadata');
            setSeoEntries(res || []);
        } catch (err) {
            console.error('Failed to fetch SEO data', err);
        }
    };



    const handleOpenForm = async () => {
        resetForm();
        setShowForm(true);
        // No need to fetch routes here, loadAllData already does it
    };

    const resetForm = () => {
        setFormData({
            page: '',
            title: '',
            description: '',
            keywords: '',
            ogImage: '',
            robots: 'index, follow',
            canonicalUrl: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (entry: any) => {
        setFormData({
            page: entry.page,
            title: entry.title,
            description: entry.description,
            keywords: Array.isArray(entry.keywords) ? entry.keywords.join(', ') : entry.keywords,
            ogImage: entry.ogImage || '',
            robots: entry.robots || 'index, follow',
            canonicalUrl: entry.canonicalUrl || ''
        });
        setEditingId(entry.page);
        setShowForm(true);
    };

    const handleConfigure = (route: any, existingEntry?: any) => {
        if (existingEntry) {
            handleEdit(existingEntry);
        } else {
            resetForm();
            setFormData(prev => ({
                ...prev,
                page: route.value,
                title: route.label // Pre-fill title from route label
            }));
            setShowForm(true);
        }
    };

    const requestDelete = (page: string) => {
        setConfirmModal({
            isOpen: true,
            page,
            title: 'Delete SEO Configuration?',
            message: `Are you sure you want to delete the SEO settings for "${page}"? This page will revert to default SEO settings.`
        });
    };

    const handleConfirmDelete = async () => {
        if (!confirmModal.page) return;

        const toastId = toast.loading('Deleting configuration...');
        try {
            await api.delete(`/seo/metadata/${confirmModal.page}`);
            // setSeoEntries(prev => prev.filter(item => item.page !== confirmModal.page)); // Replaced by loadAllData
            await loadAllData(true); // Refresh all data after delete
            toast.success('SEO configuration deleted', { id: toastId });
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete configuration', { id: toastId });
        } finally {
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.page || !formData.title || !formData.description) {
            toast.error('Page ID, Title and Description are required');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading(editingId ? 'Updating SEO...' : 'Creating SEO...');

        try {
            const processedKeywords = formData.keywords
                .split(',')
                .map(k => k.trim())
                .filter(k => k !== '');

            const payload = {
                ...formData,
                keywords: processedKeywords
            };

            await api.put(`/seo/metadata/${formData.page}`, payload);

            // await fetchSeoData(); // Replaced by loadAllData
            await loadAllData(true); // Refresh all data after submit
            resetForm();
            toast.success(editingId ? 'SEO updated successfully' : 'SEO created successfully', { id: toastId });
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to save SEO', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Merge Logic: Create a list of all displayable items
    // Strategies:
    // 1. Map all available routes to an item.
    // 2. Check if an SEO entry exists for that route.
    // 3. Also include SEO entries that don't match any route (custom pages).

    // Create a map of route values to SEO entries
    const seoMap = new Map();
    seoEntries.forEach(entry => seoMap.set(entry.page, entry));

    const allItems = availableRoutes.map(route => {
        const entry = seoMap.get(route.value);
        if (entry) {
            seoMap.delete(route.value); // Remove processed entry
            return {
                ...entry,
                routeLabel: route.label, // Use label from route for display if title is missing (unlikely) or as subtitle
                status: 'configured',
                keywords: entry.keywords || []
            };
        }
        return {
            _id: `temp-${route.value}`,
            page: route.value,
            title: route.label, // Default title from route
            description: 'No SEO configuration set.',
            status: 'missing',
            keywords: [],
            routeLabel: route.label
        };
    });

    // Add remaining SEO entries (custom ones)
    seoMap.forEach((entry) => {
        allItems.push({
            ...entry,
            status: 'configured',
            routeLabel: 'Custom Page',
            keywords: entry.keywords || []
        });
    });

    const filteredItems = allItems
        .filter(item => item.status === 'configured') // Only show configured items
        .filter(item =>
            item.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (Array.isArray(item.keywords) && item.keywords.some((k: string) => k.toLowerCase().includes(searchTerm.toLowerCase())))
        );

    const selectRoute = (routeValue: string) => {
        const route = availableRoutes.find(r => r.value === routeValue) || { value: routeValue, label: routeValue };
        const existingEntry = seoEntries.find(e => e.page === routeValue);

        if (existingEntry) {
            handleEdit(existingEntry);
        } else {
            setFormData(prev => ({
                ...prev,
                page: routeValue,
                title: route.label // Pre-fill title
            }));
        }
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">SEO Management</h2>
                        <p className="text-white/40">Manage SEO meta tags for your configured pages.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => loadAllData(false)}
                            disabled={isLoading}
                            className="p-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl transition-all border border-white/5 disabled:opacity-50"
                        >
                            <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            onClick={() => { resetForm(); setShowForm(true); }}
                            className="flex items-center gap-2 bg-emerald-500 px-6 py-3 rounded-xl text-black shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] font-bold transition-all"
                        >
                            <Plus size={20} /> Add New Page SEO
                        </button>
                    </div>
                </div>

                <div className="mt-8 relative">
                    <Search className="absolute left-4 top-3.5 text-white/20" size={20} />
                    <input
                        type="text"
                        placeholder="Search pages by title, ID, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                </div>
            </motion.div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-[#0a0a0a] border border-white/10 rounded-2xl">
                    <Globe size={48} className="mx-auto text-white/10 mb-4" />
                    <h3 className="text-xl font-bold text-white/40">No Pages Found</h3>
                    <p className="text-white/20 mt-2">Try refreshing to detect site routes.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredItems.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.22, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -2, transition: { duration: 0.15 } }}
                            className={`bg-[#0a0a0a] border rounded-xl p-6 transition-all group relative overflow-hidden ${item.status === 'configured' ? 'border-emerald-500/30 hover:border-emerald-500/50' : 'border-white/10 hover:border-white/20'}`}
                        >
                            {item.status === 'configured' && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="space-y-2 flex-grow min-w-0">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded-md text-xs font-mono border ${item.status === 'configured' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-white/5 text-white/40 border-white/5'}`}>
                                            /{item.page}
                                        </span>
                                        {item.status === 'configured' ? (
                                            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border border-emerald-500/10 flex items-center gap-1">
                                                <Check size={10} /> Configured
                                            </span>
                                        ) : (
                                            <span className="bg-white/5 text-white/30 px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border border-white/5">
                                                Not Configured
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={`text-xl font-bold truncate pr-8 ${item.status === 'configured' ? 'text-white' : 'text-white/60'}`}>{item.title}</h3>
                                    <p className="text-white/40 text-sm line-clamp-2">{item.description}</p>

                                    {item.status === 'configured' && item.keywords && item.keywords.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {item.keywords.slice(0, 5).map((k: string, i: number) => (
                                                <span key={i} className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                    {k}
                                                </span>
                                            ))}
                                            {item.keywords.length > 5 && (
                                                <span className="text-[10px] text-white/20 px-1 self-center">+{item.keywords.length - 5} more</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex md:flex-col gap-2 shrink-0">
                                    <button
                                        onClick={() => handleConfigure(item, item.status === 'configured' ? item : undefined)}
                                        className={`p-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${item.status === 'configured' ? 'bg-white/5 hover:bg-emerald-500 hover:text-black text-white/40' : 'bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/50'}`}
                                    >
                                        <Edit2 size={18} />
                                        {item.status === 'missing' && <span className="text-xs font-bold px-2 desktop:hidden">Add Tags</span>}
                                    </button>
                                    {item.status === 'configured' && (
                                        <button
                                            onClick={() => requestDelete(item.page)}
                                            className="p-2.5 bg-white/5 hover:bg-red-500 hover:text-white rounded-lg transition-all text-white/40"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a0a0a] z-50">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <Globe size={24} className="text-emerald-500" />
                                {editingId ? 'Edit SEO Settings' : 'Add New SEO Entry'}
                            </h3>
                            <button onClick={resetForm} className="text-white/40 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-white/60 mb-2">Page Identifier <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            required
                                            disabled={!!editingId}
                                            value={formData.page}
                                            onChange={(e) => {
                                                const selectedPage = e.target.value;
                                                selectRoute(selectedPage);
                                            }}
                                            className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <option value="" className="bg-neutral-900 text-white/40">Select a page...</option>
                                            {availableRoutes.map((route, idx) => {
                                                const isConfigured = seoEntries.some(entry => entry.page === route.value);
                                                return (
                                                    <option key={idx} value={route.value} className="bg-neutral-900">
                                                        {route.label} ({route.value}) {isConfigured ? '✓' : ''}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                                            <LinkIcon size={18} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Meta Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Page Title | Brand Name"
                                        required
                                        maxLength={60}
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    />
                                    <div className="flex justify-between mt-1">
                                        <p className="text-[10px] text-white/30">Recommended length: 50-60 characters</p>
                                        <p className={`text-[10px] ${formData.title.length > 60 ? 'text-red-500' : 'text-emerald-400'}`}>{formData.title.length}/60</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Meta Description <span className="text-red-500">*</span></label>
                                    <textarea
                                        rows={3}
                                        placeholder="Brief summary of the page content..."
                                        required
                                        maxLength={160}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    />
                                    <div className="flex justify-between mt-1">
                                        <p className="text-[10px] text-white/30">Recommended length: 150-160 characters</p>
                                        <p className={`text-[10px] ${formData.description.length > 160 ? 'text-red-500' : 'text-emerald-400'}`}>{formData.description.length}/160</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Keywords</label>
                                    <input
                                        type="text"
                                        placeholder="comma, separated, keywords"
                                        value={formData.keywords}
                                        onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/60 mb-2">Robots Tag</label>
                                        <select
                                            value={formData.robots}
                                            onChange={e => setFormData({ ...formData, robots: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="index, follow" className="bg-neutral-900">Index, Follow</option>
                                            <option value="noindex, follow" className="bg-neutral-900">No Index, Follow</option>
                                            <option value="index, nofollow" className="bg-neutral-900">Index, No Follow</option>
                                            <option value="noindex, nofollow" className="bg-neutral-900">No Index, No Follow</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/60 mb-2">Canonical URL (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            value={formData.canonicalUrl}
                                            onChange={e => setFormData({ ...formData, canonicalUrl: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">OG Image URL (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={formData.ogImage}
                                        onChange={e => setFormData({ ...formData, ogImage: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 rounded-xl font-bold text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-black rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={18} />}
                                    {editingId ? 'Update Settings' : 'Save Settings'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmDelete}
                title={confirmModal.title}
                message={confirmModal.message}
                isDestructive={true}
                confirmText="Delete"
            />
        </div>
    );
};

export default Seo;
