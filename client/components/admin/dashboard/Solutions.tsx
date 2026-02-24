'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, X, Lightbulb, RefreshCcw } from 'lucide-react';
import api from '@/utils/api';
import { useSolutions } from '@/hooks/usePageData';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const Solutions = ({ searchQuery = '' }: { searchQuery?: string }) => {
    const queryClient = useQueryClient();
    const { data: solutions = [], isLoading, isFetching, refetch } = useSolutions();

    const filteredSolutions = solutions.filter((solution: any) =>
        (solution.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (solution.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<any>({
        title: '',
        slug: '',
        description: '',
        problemSolved: '',
        targetAudience: '',
        coreCapabilities: [],
        outcome: '',
        tags: [],
        cta: '',
        illustration: ''
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [originalImage, setOriginalImage] = useState('');

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: null as string | null,
        title: '',
        message: ''
    });

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setIsUploading(true);
        setUploadProgress(0);

        const toastId = toast.loading('Uploading illustration...');

        try {
            const data = new FormData();
            data.append('image', file);
            const res: any = await api.post('/upload/solution-image', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            });
            setFormData((prev: any) => ({ ...prev, illustration: res?.imageUrl }));
            setUploadProgress(100);
            toast.success('Illustration uploaded', { id: toastId });
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Illustration upload failed', { id: toastId });
            setImageFile(null);
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            description: '',
            problemSolved: '',
            targetAudience: '',
            coreCapabilities: [],
            outcome: '',
            tags: [],
            cta: '',
            illustration: ''
        });
        setEditingId(null);
        setImageFile(null);
        setShowForm(false);
    };

    const handleEdit = (solution: any) => {
        setFormData({
            title: solution.title,
            slug: solution.slug,
            description: solution.description,
            problemSolved: solution.problem || solution.problemSolved || '',
            targetAudience: solution.targetAudience || '',
            coreCapabilities: solution.coreCapabilities || [],
            outcome: solution.outcome || '',
            tags: solution.tags || [],
            cta: solution.cta || '',
            illustration: solution.illustration || ''
        });
        setOriginalImage(solution.illustration || '');
        setEditingId(solution._id);
        setImageFile(null);
        setShowForm(true);
    };

    const removeImage = () => {
        setImageFile(null);
        setFormData((prev: any) => ({ ...prev, illustration: originalImage }));
    };

    const requestDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            id,
            title: 'Delete Solution?',
            message: 'Are you sure you want to permanently delete this solution? This action cannot be undone.'
        });
    };

    const handleConfirmDelete = async () => {
        if (!confirmModal.id) return;
        const toastId = toast.loading('Deleting solution...');
        try {
            await api.delete(`/solutions/${confirmModal.id}`);
            queryClient.invalidateQueries({ queryKey: ['solutions'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
            toast.success('Solution deleted successfully', { id: toastId });
        } catch (error) {
            console.error('Error deleting solution:', error);
            toast.error('Failed to delete solution', { id: toastId });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            toast.error('Title and Description are required');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading(editingId ? 'Updating solution...' : 'Adding solution...');

        try {
            const payload = {
                title: formData.title,
                slug: formData.slug,
                description: formData.description,
                problem: formData.problemSolved,
                problemSolved: formData.problemSolved,
                targetAudience: formData.targetAudience,
                coreCapabilities: formData.coreCapabilities,
                outcome: formData.outcome,
                tags: formData.tags,
                cta: formData.cta,
                illustration: formData.illustration
            };

            if (editingId) {
                await api.put(`/solutions/${editingId}`, payload);
            } else {
                await api.post('/solutions', payload);
            }
            queryClient.invalidateQueries({ queryKey: ['solutions'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
            resetForm();
            toast.success(editingId ? 'Solution updated successfully!' : 'Solution added successfully!', { id: toastId });
        } catch (error) {
            console.error('Error saving solution:', error);
            toast.error('Failed to save solution', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Manage Solutions</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="p-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl transition-all border border-white/5 disabled:opacity-50"
                        title="Force Refresh Data"
                    >
                        <RefreshCcw size={18} className={isFetching ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded-xl font-semibold transition-all"
                    >
                        <Plus size={18} />
                        Add Solution
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredSolutions.map((solution: any, i: number) => (
                    <motion.div
                        key={solution._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        onClick={() => handleEdit(solution)}
                        className="group bg-[#0f0f0f] border border-[#222222] rounded-2xl p-5 sm:p-6 hover:border-[#333333] transition-colors relative cursor-pointer min-h-[180px] sm:min-h-[200px] flex flex-col"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center text-zinc-300 flex-shrink-0">
                                <Lightbulb size={24} />
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); requestDelete(solution._id); }}
                                className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-30 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex-grow flex flex-col min-w-0">
                            <h3 className="text-lg font-semibold text-white truncate mb-1" title={solution.title}>{solution.title}</h3>
                            <p className="text-sm font-medium text-emerald-500 mb-3 truncate" title={solution.slug}>{solution.slug}</p>
                            <p className="text-sm text-zinc-400 line-clamp-2 mb-4 h-[40px] leading-relaxed">{solution.description}</p>

                            <div className="flex flex-col gap-3 mt-auto">
                                <div className="w-full h-px bg-[#222222]" />
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {(solution.tags || []).slice(0, 3).map((tag: string, i: number) => (
                                        <span key={i} className="px-2 py-0.5 rounded bg-[#1c1c1c] text-[11px] font-medium text-zinc-400 truncate max-w-[90px]">
                                            {tag}
                                        </span>
                                    ))}
                                    {(solution.tags || []).length > 3 && (
                                        <span className="text-[11px] font-medium text-zinc-500 mt-0.5">+{solution.tags.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-22xl">
                        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-zinc-800/80 backdrop-blur-2xl z-10">
                            <h3 className="text-lg font-bold">{editingId ? 'Edit Solution' : 'Add New Solution'}</h3>
                            <button onClick={resetForm} className="text-white/40 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-1">Title</label>
                                            <input
                                                type="text"
                                                required
                                                minLength={5}
                                                maxLength={100}
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                                placeholder="e.g. Finance Hub"
                                            />
                                            <p className={`text-[10px] mt-1 ${formData.title.length >= 5 && formData.title.length <= 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {formData.title.length}/100 <span>{formData.title.length < 5 ? '(Min 5 chars)' : formData.title.length > 100 ? '(Max 100 chars)' : '(Valid)'}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-1">Slug</label>
                                            <input
                                                type="text"
                                                required
                                                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                                                minLength={3}
                                                maxLength={100}
                                                value={formData.slug}
                                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                                placeholder="e.g. finance-hub"
                                            />
                                            <p className={`text-[10px] mt-1 ${/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug) && formData.slug.length >= 3 && formData.slug.length <= 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {formData.slug.length}/100 <span>{
                                                    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug) ? '(Lowercase, numbers, hyphens only)' :
                                                        formData.slug.length < 3 ? '(Min 3 chars)' :
                                                            formData.slug.length > 100 ? '(Max 100 chars)' : '(Valid)'
                                                }</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/60 mb-1">Short Description</label>
                                        <textarea
                                            rows={3}
                                            required
                                            minLength={10}
                                            maxLength={200}
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                            placeholder="Brief overview (max 200 characters)..."
                                        />
                                        <p className={`text-[10px] mt-1 ${formData.description.length >= 10 && formData.description.length <= 200 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {formData.description.length}/200 <span>{formData.description.length < 10 ? '(Min 10 chars)' : formData.description.length > 200 ? '(Max 200 chars)' : '(Valid)'}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/60 mb-1">Problem Solved</label>
                                        <input
                                            type="text"
                                            required
                                            minLength={10}
                                            maxLength={200}
                                            value={formData.problemSolved}
                                            onChange={e => setFormData({ ...formData, problemSolved: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                            placeholder="What pain point does this address?"
                                        />
                                        <p className={`text-[10px] mt-1 ${formData.problemSolved?.length >= 10 && formData.problemSolved?.length <= 200 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {formData.problemSolved?.length || 0}/200 <span>{(formData.problemSolved?.length || 0) < 10 ? '(Min 10 chars)' : (formData.problemSolved?.length || 0) > 200 ? '(Max 200 chars)' : '(Valid)'}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/60 mb-1">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            maxLength={500}
                                            value={formData.tags.join(', ')}
                                            onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map((s: string) => s.trim()).filter((s: string) => s) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                            placeholder="Finance, SaaS, Enterprise"
                                        />
                                        <p className="text-[10px] text-white/40 mt-1 max-w-full truncate">Max 500 chars for list items</p>
                                    </div>
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-white/60 mb-1">Solution Illustration / Image</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                id="solution-image"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="solution-image"
                                                className="flex items-center justify-center gap-3 w-full bg-white/5 border border-white/10 border-dashed rounded-xl px-4 py-12 cursor-pointer hover:bg-white/10 hover:border-emerald-500/50 transition-all h-full min-h-[140px] relative overflow-hidden"
                                            >
                                                <div className="text-center">
                                                    <p className="text-sm font-bold text-white">
                                                        {imageFile ? imageFile.name : formData.illustration ? 'Change Image' : 'Click to upload illustration'}
                                                    </p>
                                                    <p className="text-xs text-white/40 mt-1">SVG, PNG or JPG recommended</p>
                                                </div>
                                                {isUploading && (
                                                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/10 overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </label>

                                            {editingId && formData.illustration !== originalImage && (
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                                                >
                                                    <RefreshCcw size={12} />
                                                    Reset to Original Illustration
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl text-white/60 hover:bg-white/5 transition-all">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isUploading}
                                    className="px-8 py-2.5 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                                >
                                    {isUploading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                            <span>{uploadProgress}%</span>
                                        </div>
                                    ) : editingId ? 'Update Solution' : 'Add Solution'}
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
                confirmText="Delete Solution"
            />
        </div>
    );
};

export default Solutions;
