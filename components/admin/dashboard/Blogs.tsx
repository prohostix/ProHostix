'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, X, RefreshCcw } from 'lucide-react';
import api from '@/utils/api';
import { getAbsoluteImageUrl } from '@/utils/imageUrl';
import { useBlogs } from '@/hooks/usePageData';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const Blogs = ({ searchQuery = '' }: { searchQuery?: string }) => {
    const queryClient = useQueryClient();
    const { data: blogs = [], isLoading, isFetching, refetch } = useBlogs();

    const filteredBlogs = blogs.filter((blog: any) =>
        (blog.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (blog.excerpt?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [originalImage, setOriginalImage] = useState('');

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: null as string | null,
        title: '',
        message: ''
    });

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: 'Technology',
        author: 'Admin',
        published: true
    });

    const resetForm = () => {
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            image: '',
            category: 'Technology',
            author: 'Admin',
            published: true
        });
        setImageFile(null);
        setImagePreview('');
        setEditingId(null);
        setShowForm(false);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));

        setIsUploading(true);
        setUploadProgress(0);

        const toastId = toast.loading('Uploading image...');

        try {
            const data = new FormData();
            data.append('image', file);

            const res: any = await api.post('/upload/blog-image', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            });

            setFormData(prev => ({ ...prev, image: res?.imageUrl }));
            setUploadProgress(100);
            toast.success('Image uploaded successfully', { id: toastId });
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Image upload failed', { id: toastId });
            setImageFile(null);
            setImagePreview('');
        } finally {
            setIsUploading(false);
        }
    };

    const handleEdit = (blog: any) => {
        setFormData({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            image: blog.image,
            category: blog.category,
            author: blog.author,
            published: blog.published
        });

        setImageFile(null);
        setImagePreview('');
        setOriginalImage(blog.image || '');
        setEditingId(blog._id);
        setShowForm(true);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData(prev => ({ ...prev, image: originalImage }));
    };

    const requestDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            id,
            title: 'Delete Blog?',
            message: 'Are you sure you want to permanently delete this blog post? This action cannot be undone.'
        });
    };

    const handleConfirmDelete = async () => {
        if (!confirmModal.id) return;

        const toastId = toast.loading('Deleting blog...');
        try {
            await api.delete(`/blogs/${confirmModal.id}`);
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            toast.success('Blog deleted successfully', { id: toastId });
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete blog', { id: toastId });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            toast.error('Title and Content are required');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading(editingId ? 'Updating blog...' : 'Creating blog...');

        try {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            const payload = {
                ...formData,
                slug,
            };

            if (editingId) {
                await api.put(`/blogs/${editingId}`, payload);
            } else {
                await api.post('/blogs', payload);
            }

            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
            resetForm();
            toast.success(editingId ? 'Blog updated successfully' : 'Blog created successfully', { id: toastId });
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to save blog', { id: toastId });
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Manage Blogs</h2>
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
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-emerald-500 px-4 py-2 rounded-xl text-black shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] font-semibold transition-all"
                    >
                        <Plus size={18} /> Create New
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl text-left">
                        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between">
                            <h3 className="font-bold">
                                {editingId ? 'Edit Blog' : 'Create Blog'}
                            </h3>
                            <button onClick={resetForm}><X /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-4">
                                        <div>
                                            <input
                                                placeholder="Title"
                                                required
                                                minLength={5}
                                                maxLength={100}
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500"
                                            />
                                            <p className={`text-[10px] mt-1 ${formData.title.length >= 5 && formData.title.length <= 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {formData.title.length}/100 <span>{formData.title.length < 5 ? '(Min 5 chars)' : formData.title.length > 100 ? '(Max 100 chars)' : '(Valid)'}</span>
                                            </p>
                                        </div>

                                        <div>
                                            <textarea
                                                placeholder="Excerpt"
                                                rows={3}
                                                required
                                                minLength={20}
                                                maxLength={200}
                                                value={formData.excerpt}
                                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500"
                                            />
                                            <p className={`text-[10px] mt-1 ${formData.excerpt.length >= 20 && formData.excerpt.length <= 200 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {formData.excerpt.length}/200 <span>{formData.excerpt.length < 20 ? '(Min 20 chars)' : formData.excerpt.length > 200 ? '(Max 200 chars)' : '(Valid)'}</span>
                                            </p>
                                        </div>

                                        <div>
                                            <textarea
                                                placeholder="Content"
                                                rows={8}
                                                required
                                                minLength={50}
                                                value={formData.content}
                                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500"
                                            />
                                            <p className={`text-[10px] mt-1 ${formData.content.length >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {formData.content.length} chars <span>{formData.content.length < 50 ? '(Min 50 chars)' : '(Valid)'}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-white/60">Cover Image</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="blog-image"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="blog-image"
                                                className="flex items-center justify-center gap-3 w-full bg-white/5 border border-white/10 border-dashed rounded-xl px-4 py-12 cursor-pointer hover:bg-white/10 hover:border-emerald-500/50 transition-all group relative overflow-hidden"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                                    <Plus size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-white">
                                                        {imageFile ? imageFile.name : formData.image ? 'Change Image' : 'Choose Image'}
                                                    </p>
                                                    <p className="text-xs text-white/40">PNG, JPG or WebP up to 5MB</p>
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

                                            {editingId && formData.image !== originalImage && (
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                                                >
                                                    <RefreshCcw size={12} />
                                                    Reset to Original Image
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isSubmitting || isUploading}
                                    className="px-8 py-2.5 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                                >
                                    {isUploading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                            <span>{uploadProgress}%</span>
                                        </div>
                                    ) : editingId ? 'Update Post' : 'Publish Blog'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredBlogs.map((blog: any, i: number) => (
                    <motion.div
                        key={blog._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        onClick={() => handleEdit(blog)}
                        className="bg-[#0f0f0f] border border-[#222222] rounded-2xl overflow-hidden hover:border-[#333333] transition-colors cursor-pointer group flex flex-col min-h-[280px] sm:min-h-[320px]"
                    >
                        <div className="relative">
                            {blog.image ? (
                                <img
                                    src={getAbsoluteImageUrl(blog.image)}
                                    alt={blog.title}
                                    className="h-32 sm:h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="h-32 sm:h-40 w-full bg-[#141414] border-b border-[#222222] flex items-center justify-center">
                                    <span className="text-zinc-600 font-medium text-xs">No Cover Image</span>
                                </div>
                            )}
                            <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                    onClick={(e) => { e.stopPropagation(); requestDelete(blog._id); }}
                                    className="p-1.5 bg-black/50 backdrop-blur-md rounded-lg text-white hover:text-red-400 hover:bg-red-400/20 transition-all border border-white/10"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f0f0f] to-transparent pointer-events-none" />
                        </div>

                        <div className="p-5 sm:p-6 flex flex-col flex-grow text-left">
                            <h3 className="text-lg font-semibold text-white truncate mb-2" title={blog.title}>{blog.title}</h3>
                            <p className="text-sm font-medium text-zinc-400 line-clamp-2 h-[40px] leading-relaxed">
                                {blog.excerpt}
                            </p>

                            <div className="flex flex-col gap-3 mt-auto">
                                <div className="w-full h-px bg-[#222222]" />
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                                        {blog.category || 'Technology'}
                                    </span>
                                    <span className="text-[11px] font-medium text-zinc-500">
                                        {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!isLoading && filteredBlogs.length === 0 && (
                <p className="text-white/40 text-center">No blogs found</p>
            )}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmDelete}
                title={confirmModal.title}
                message={confirmModal.message}
                isDestructive={true}
                confirmText="Delete Blog"
            />
        </div>
    );
};

export default Blogs;
