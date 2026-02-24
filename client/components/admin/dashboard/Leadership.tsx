'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, X, User, RefreshCcw } from 'lucide-react';
import api from '@/utils/api';
import { useLeadership } from '@/hooks/usePageData';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const Leadership = ({ searchQuery = '' }: { searchQuery?: string }) => {
    const queryClient = useQueryClient();
    const { data: members = [], isLoading, isFetching, refetch } = useLeadership();

    const filteredMembers = members.filter((member: any) =>
        (member.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (member.role?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (member.specialization?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        desc: '',
        specialization: '',
        avatar: ''
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

        const toastId = toast.loading('Uploading portrait...');

        try {
            const data = new FormData();
            data.append('image', file);
            const res: any = await api.post('/upload/leadership-image', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            });
            setFormData(prev => ({ ...prev, avatar: res?.imageUrl }));
            setUploadProgress(100);
            toast.success('Portrait uploaded', { id: toastId });
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Portrait upload failed', { id: toastId });
            setImageFile(null);
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            role: '',
            desc: '',
            specialization: '',
            avatar: ''
        });
        setEditingId(null);
        setImageFile(null);
        setShowForm(false);
    };

    const handleEdit = (member: any) => {
        setFormData({
            name: member.name,
            role: member.role,
            desc: member.desc,
            specialization: member.specialization || '',
            avatar: member.avatar || ''
        });
        setOriginalImage(member.avatar || '');
        setEditingId(member._id);
        setImageFile(null);
        setShowForm(true);
    };

    const removeImage = () => {
        setImageFile(null);
        setFormData(prev => ({ ...prev, avatar: originalImage }));
    };

    const requestDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            id,
            title: 'Delete Member?',
            message: 'Are you sure you want to remove this leadership member? This action cannot be undone.'
        });
    };

    const handleConfirmDelete = async () => {
        if (!confirmModal.id) return;
        const toastId = toast.loading('Deleting member...');
        try {
            await api.delete(`/leadership/${confirmModal.id}`);
            queryClient.invalidateQueries({ queryKey: ['leadership'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
            toast.success('Member deleted successfully', { id: toastId });
        } catch (error) {
            console.error('Error deleting member:', error);
            toast.error('Failed to delete member', { id: toastId });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.role) {
            toast.error('Name and Role are required');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading(editingId ? 'Updating member...' : 'Adding member...');

        try {
            const payload = { ...formData };

            if (editingId) {
                await api.put(`/leadership/${editingId}`, payload);
            } else {
                await api.post('/leadership', payload);
            }
            queryClient.invalidateQueries({ queryKey: ['leadership'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
            resetForm();
            toast.success(editingId ? 'Member updated successfully' : 'Member added successfully', { id: toastId });
        } catch (error) {
            console.error('Error saving member:', error);
            toast.error('Failed to save member', { id: toastId });
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
                <div>
                    <h2 className="text-xl font-bold">Company Leadership</h2>
                </div>
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
                        Add Member
                    </button>
                </div>
            </div>

            {filteredMembers.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] text-white/20">
                    <User size={48} className="mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-sm">No Leadership nodes found</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-6 text-emerald-400 hover:text-emerald-300 text-xs uppercase tracking-widest"
                    >
                        Initialize First Record //
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6">
                    {filteredMembers.map((member: any, i: number) => (
                        <motion.div
                            key={member._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.22, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            onClick={() => handleEdit(member)}
                            className="group relative h-[480px] sm:h-[550px] bg-zinc-800/80 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500 flex flex-col cursor-pointer"
                        >
                            <div className="absolute top-6 right-6 z-30 flex gap-2 opacity-30 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                <button
                                    onClick={(e) => { e.stopPropagation(); requestDelete(member._id); }}
                                    className="p-3 bg-black/60 backdrop-blur-md rounded-xl text-red-500/70 hover:text-white hover:bg-red-600 transition-all border border-white/10"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="relative h-[220px] w-full overflow-hidden bg-white/5">
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
                                {member.avatar ? (
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/5">
                                        <User size={64} />
                                    </div>
                                )}
                                {member.specialization && (
                                    <div className="absolute bottom-6 left-8 px-4 py-1.5 rounded-full bg-emerald-500 text-[9px] font-black uppercase text-black shadow-2xl z-20">
                                        {member.specialization}
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow p-6 sm:p-8 flex flex-col text-left">
                                <div className="h-[80px] mb-4 min-w-0">
                                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tighter group-hover:text-emerald-400 transition-colors uppercase leading-[1.1] line-clamp-2" title={member.name}>
                                        {member.name}
                                    </h3>
                                    <div className="mt-2 text-emerald-500/60 text-[9px] uppercase font-bold tracking-[0.3em] truncate" title={member.role}>
                                        {member.role}
                                    </div>
                                </div>

                                <div className="h-[1px] w-8 bg-emerald-500/20 mb-4" />

                                <div className="flex-grow">
                                    <p className="text-white/50 text-xs sm:text-sm leading-relaxed line-clamp-3 font-medium italic">
                                        "{member.desc}"
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 flex justify-between items-center border-t border-white/5">
                                    <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest">Node_ID: {member._id.slice(-6)}</span>
                                    <div className="w-8 h-[1px] bg-white/5" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-xl">
                    <div className="bg-zinc-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-22xl flex flex-col text-left">
                        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-zinc-800/80 backdrop-blur-2xl z-10">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter">{editingId ? 'Edit Leadership' : 'Add New Member'}</h3>
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-1 font-bold">Leadership Team Management</p>
                            </div>
                            <button onClick={resetForm} className="text-white/40 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6 sm:space-y-8 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-1">Full_Name</label>
                                            <input
                                                type="text"
                                                required
                                                minLength={2}
                                                maxLength={50}
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                placeholder="Full Name"
                                            />
                                            <p className={`text-[10px] mt-1 ${formData.name.length >= 2 && formData.name.length <= 50 ? 'text-emerald-400' : 'text-white/30'}`}>
                                                {formData.name.length}/50 <span>{formData.name.length < 2 ? '(Min 2 chars)' : formData.name.length > 50 ? '(Max 50 chars)' : ''}</span>
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-1">Functional_Role</label>
                                            <input
                                                type="text"
                                                required
                                                minLength={2}
                                                maxLength={50}
                                                value={formData.role}
                                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                placeholder="e.g. CTO"
                                            />
                                            <p className={`text-[10px] mt-1 ${formData.role.length >= 2 && formData.role.length <= 50 ? 'text-emerald-400' : 'text-white/30'}`}>
                                                {formData.role.length}/50 <span>{formData.role.length < 2 ? '(Min 2 chars)' : formData.role.length > 50 ? '(Max 50 chars)' : ''}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-1">Focus_Specialty</label>
                                        <input
                                            type="text"
                                            minLength={2}
                                            maxLength={30}
                                            value={formData.specialization}
                                            onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                            placeholder="e.g. Core Infra"
                                        />
                                        <p className={`text-[10px] mt-1 ${formData.specialization?.length >= 2 && formData.specialization?.length <= 30 ? 'text-emerald-400' : formData.specialization?.length === 0 ? 'text-white/30' : 'text-red-400'}`}>
                                            {formData.specialization?.length || 0}/30 <span>{(formData.specialization?.length || 0) > 30 ? '(Max 30 chars)' : ''}</span>
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-1">Member_Biography</label>
                                        <textarea
                                            rows={5}
                                            required
                                            minLength={20}
                                            maxLength={500}
                                            value={formData.desc}
                                            onChange={e => setFormData({ ...formData, desc: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white/60 focus:text-white leading-relaxed focus:outline-none focus:border-emerald-500 transition-all text-sm"
                                            placeholder="Brief professional biography..."
                                        />
                                        <p className={`text-[10px] mt-1 ${formData.desc.length >= 20 && formData.desc.length <= 500 ? 'text-emerald-400' : 'text-white/30'}`}>
                                            {formData.desc.length}/500 <span>{formData.desc.length < 20 ? '(Min 20 chars)' : formData.desc.length > 500 ? '(Max 500 chars)' : ''}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2 h-full flex flex-col">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-1">Portrait_Asset</label>
                                        <div className="relative group flex-grow">
                                            <input
                                                type="file"
                                                id="leadership-image"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="leadership-image"
                                                className="flex items-center justify-center gap-3 w-full bg-white/5 border border-white/10 border-dashed rounded-2xl px-4 py-12 cursor-pointer hover:bg-white/10 hover:border-emerald-500/50 transition-all h-full min-h-[220px] relative overflow-hidden"
                                            >
                                                <div className="text-center">
                                                    <p className="text-sm font-bold text-white">
                                                        {imageFile ? imageFile.name : formData.avatar ? 'Change Portrait Image' : 'Click to upload portrait'}
                                                    </p>
                                                    <p className="text-xs text-white/40 mt-1">JPG, PNG or WebP recommended</p>
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

                                            {editingId && formData.avatar !== originalImage && (
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                                                >
                                                    <RefreshCcw size={12} />
                                                    Reset to Original Portrait
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 rounded-xl text-white/60 hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
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
                                    ) : editingId ? 'Update' : 'Add Member'}
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
                confirmText="Delete Member"
            />
        </div>
    );
};

export default Leadership;
