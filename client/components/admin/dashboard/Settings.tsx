import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Shield, Loader2, Camera, Globe, Mail, Phone, MapPin, Share2, Plus, Trash2, Edit2, ExternalLink, Check, X, Eye, EyeOff } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import api from '@/utils/api';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [socialLinks, setSocialLinks] = useState<any[]>([]);
    const [isSocialLoading, setIsSocialLoading] = useState(false);
    const [socialForm, setSocialForm] = useState({ platform: '', url: '', icon: 'Globe', id: '', isActive: true });
    const [isEditingSocial, setIsEditingSocial] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [status, setStatus] = useState<{ message: string; type: 'success' | 'error'; section: string } | null>(null);

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: null as string | null,
        title: '',
        message: ''
    });

    const showStatus = (message: string, type: 'success' | 'error', section: string) => {
        setStatus({ message, type, section });
        setTimeout(() => setStatus(null), 5000);
    };

    const getStoredUser = () => {
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('user') || '{}');
        }
        return {};
    };

    const storedUser = getStoredUser();
    const [formData, setFormData] = useState({
        name: storedUser.name || '',
        bio: storedUser.bio || '',
        avatar: storedUser.avatar || ''
    });


    useEffect(() => {
        fetchSocialLinks();
    }, []);

    const fetchSocialLinks = async () => {
        setIsSocialLoading(true);
        try {
            const res: any = await api.get('/social-links');
            setSocialLinks(res || []);
        } catch (err) {
            console.error('Failed to fetch social links', err);
        } finally {
            setIsSocialLoading(false);
        }
    };

    const handleSocialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditingSocial) {
                await api.put(`/social-links/${socialForm.id}`, {
                    platform: socialForm.platform,
                    url: socialForm.url,
                    icon: socialForm.icon,
                    isActive: socialForm.isActive
                });
            } else {
                await api.post('/social-links', socialForm);
            }
            fetchSocialLinks();
            setSocialForm({ platform: '', url: '', icon: 'Globe', id: '', isActive: true });
            setIsEditingSocial(false);
            showStatus(`Social link ${isEditingSocial ? 'updated' : 'added'} successfully`, 'success', 'social');
        } catch (err) {
            console.error(err);
            showStatus('Operation failed', 'error', 'social');
        } finally {
            setIsLoading(false);
        }
    };

    const requestDeleteSocial = (id: string) => {
        setConfirmModal({
            isOpen: true,
            id,
            title: 'Delete Social Link?',
            message: 'Are you sure you want to delete this social link?'
        });
    };

    const handleConfirmDeleteSocial = async () => {
        if (!confirmModal.id) return;
        try {
            await api.delete(`/social-links/${confirmModal.id}`);
            fetchSocialLinks();
            showStatus('Social link deleted successfully', 'success', 'social');
        } catch (err) {
            console.error(err);
            showStatus('Delete failed', 'error', 'social');
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            showStatus('All password fields are required', 'error', 'security');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showStatus('New passwords do not match', 'error', 'security');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showStatus('New password must be at least 6 characters', 'error', 'security');
            return;
        }

        setIsLoading(true);

        try {
            await api.put('/users/profile', {
                currentPassword: passwordData.currentPassword,
                password: passwordData.newPassword
            });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showStatus('Password updated successfully!', 'success', 'security');
        } catch (err: any) {
            console.error(err);
            showStatus(err.response?.data?.message || 'Failed to update password', 'error', 'security');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploadingAvatar(true);
            setUploadProgress(0);

            // Set local preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            try {
                const data = new FormData();
                data.append('image', file);
                const res: any = await api.post('/upload/profile-image', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(progress);
                        }
                    }
                });

                if (res?.imageUrl) {
                    setFormData(prev => ({ ...prev, avatar: res.imageUrl }));
                }
                setUploadProgress(100);
            } catch (err) {
                console.error(err);
                showStatus('Failed to upload avatar', 'error', 'profile');
            } finally {
                setIsUploadingAvatar(false);
            }
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        if (e) e.preventDefault();

        // Validation
        if (!formData.name || formData.name.trim().length < 2 || formData.name.trim().length > 50) {
            showStatus('Display Name must be between 2 and 50 characters', 'error', 'profile');
            return;
        }

        if (formData.bio && formData.bio.length > 300) {
            showStatus('Bio cannot exceed 300 characters', 'error', 'profile');
            return;
        }

        setIsLoading(true);

        try {
            const res: any = await api.put('/users/profile', formData);

            // Update localStorage
            const updatedUser = { ...storedUser, ...res };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Notify other components like Dashboard header
            window.dispatchEvent(new Event('user-updated'));

            setFormData({
                name: res.name,
                bio: res.bio,
                avatar: res.avatar
            });
            setImagePreview('');

            showStatus('Profile updated successfully!', 'success', 'profile');
        } catch (err: any) {
            console.error(err);
            showStatus(err.response?.data?.message || 'Failed to update profile', 'error', 'profile');
        } finally {
            setIsLoading(false);
            setIsUploadingAvatar(false);
        }
    };


    const handleQuickUpdate = async (id: string, updates: any) => {
        try {
            await api.put(`/social-links/${id}`, updates);
            fetchSocialLinks();
            showStatus('Updated successfully', 'success', 'social');
        } catch (err) {
            console.error('Update failed', err);
            showStatus('Update failed', 'error', 'social');
        }
    };

    const sections = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'social', label: 'Social Media CRUD', icon: Share2 },
        { id: 'security', label: 'Security & Password', icon: Lock },
    ];


    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[60vh]">
            <div className="space-y-2">
                {sections.map((section, i) => (
                    <motion.button
                        key={section.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${activeSection === section.id
                            ? 'bg-white/10 text-white border border-white/20'
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <section.icon size={18} />
                        {section.label}
                    </motion.button>
                ))}
            </div>

            <div className="lg:col-span-3 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8"
                >
                    <div className="flex-1 min-w-0">
                        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
                        <p className="text-white/40">Manage your account preferences and global site settings.</p>
                    </div>
                </motion.div>

                {/* Status Banner */}
                {status && (status.section === activeSection || !status.section) && (
                    <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-500'
                        }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${status.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                            {status.type === 'success' ? <Check size={16} /> : <X size={16} />}
                        </div>
                        <p className="text-sm font-medium">{status.message}</p>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 min-h-[500px]"
                >
                    {activeSection === 'profile' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold mb-6">Profile Settings</h3>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-4xl font-black text-black border-4 border-[#0a0a0a] shadow-xl overflow-hidden relative">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                                        ) : formData.avatar ? (
                                            <img src={formData.avatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            (formData.name || 'A').charAt(0).toUpperCase()
                                        )}

                                        {isUploadingAvatar && (
                                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                                                <Loader2 size={24} className="animate-spin text-emerald-500" />
                                                <span className="text-[10px] font-medium text-white mt-1">{uploadProgress}%</span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-white"
                                    >
                                        <Camera size={20} />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold">{formData.name}</h4>
                                    <p className="text-white/40">{storedUser.email}</p>
                                    <button
                                        onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
                                        disabled={isUploadingAvatar}
                                        className="text-emerald-400 text-sm mt-2 hover:underline flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isUploadingAvatar ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                <span>Uploading {uploadProgress}%</span>
                                            </>
                                        ) : 'Change Avatar'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${formData.name.trim().length < 2 || formData.name.trim().length > 50
                                            ? 'border-red-500/50 focus:border-red-500'
                                            : 'border-emerald-500/50 focus:border-emerald-500'
                                            }`}
                                    />
                                    <div className="flex justify-between mt-1">
                                        <p className={`text-[10px] ${formData.name.trim().length < 2 || formData.name.trim().length > 50 ? 'text-red-500' : 'text-emerald-400'}`}>
                                            {formData.name.trim().length < 2
                                                ? 'Minimum 2 characters required'
                                                : formData.name.trim().length > 50
                                                    ? 'Maximum 50 characters allowed'
                                                    : ''}
                                        </p>
                                        <p className={`text-[10px] ${formData.name.trim().length > 50 ? 'text-red-500' : 'text-white/40'}`}>
                                            {formData.name.length}/50
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue={storedUser.email}
                                        disabled
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 cursor-not-allowed"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-white/60 mb-2">Bio</label>
                                    <textarea
                                        rows={4}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        placeholder="Tell a little about yourself..."
                                    />
                                    <div className="flex justify-between mt-1">
                                        <p className={`text-[10px] ${formData.bio.length > 300 ? 'text-red-500' : 'text-white/40'}`}>
                                            {formData.bio.length}/300 characters
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-end">
                                <button
                                    onClick={handleProfileUpdate}
                                    disabled={isLoading || isUploadingAvatar || formData.name.trim().length < 2 || formData.name.trim().length > 50 || formData.bio.length > 300}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isLoading || isUploadingAvatar ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Saving ...</span>
                                        </>
                                    ) : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeSection === 'social' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Social Media Management</h3>
                                <p className="text-white/40 text-sm mb-8">Manage the social media presence displayed across the platform.</p>
                            </div>

                            <form onSubmit={handleSocialSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4">
                                    {isEditingSocial ? 'Edit Link' : 'Add New Link'}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs text-white/40 mb-2 uppercase font-bold">Platform Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. LinkedIn"
                                            value={socialForm.platform}
                                            onChange={e => setSocialForm({ ...socialForm, platform: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-white/40 mb-2 uppercase font-bold">Icon Name (Lucide)</label>
                                        <select
                                            value={socialForm.icon}
                                            onChange={e => setSocialForm({ ...socialForm, icon: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="X" className="bg-neutral-900">X (Twitter)</option>
                                            <option value="Instagram" className="bg-neutral-900">Instagram</option>
                                            <option value="Facebook" className="bg-neutral-900">Facebook</option>
                                            <option value="Youtube" className="bg-neutral-900">YouTube</option>
                                            <option value="Mail" className="bg-neutral-900">Mail</option>
                                            <option value="Globe" className="bg-neutral-900">Other / Globe</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-white/40 mb-2 uppercase font-bold">Full URL</label>
                                        <input
                                            type="url"
                                            required
                                            placeholder="https://..."
                                            value={socialForm.url}
                                            onChange={e => setSocialForm({ ...socialForm, url: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>


                                <div className="flex justify-end gap-3 mt-4">
                                    {isEditingSocial && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditingSocial(false);
                                                setSocialForm({ platform: '', url: '', icon: 'Globe', id: '', isActive: true });
                                            }}
                                            className="px-4 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                    >
                                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : isEditingSocial ? 'Update Link' : 'Add Social Link'}
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">Active Social Links</h4>
                                {isSocialLoading ? (
                                    <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-emerald-500" /></div>
                                ) : socialLinks.length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-white/20">
                                        No social links added yet.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {socialLinks.map((link: any) => {
                                            const IconComp = (LucideIcons as any)[link.icon] || Globe;
                                            return (
                                                <div key={link._id} className="group flex flex-col p-5 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.04] transition-all gap-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-all ${link.isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/5 text-white/20'}`}>
                                                                <IconComp size={20} />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <h5 className="font-bold text-white text-sm truncate">{link.platform}</h5>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <button
                                                                        onClick={() => handleQuickUpdate(link._id, { isActive: !link.isActive })}
                                                                        className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded border transition-colors ${link.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
                                                                    >
                                                                        {link.isActive ? 'Active' : 'Hidden'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-30 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => {
                                                                    setSocialForm({ platform: link.platform, url: link.url, icon: link.icon, id: link._id, isActive: link.isActive });
                                                                    setIsEditingSocial(true);
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }}
                                                                className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                                title="Edit All Details"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => requestDeleteSocial(link._id)}
                                                                className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Platform URL</label>
                                                        <div className="relative group/input">
                                                            <input
                                                                type="text"
                                                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/80 focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                                                                defaultValue={link.url}
                                                                onBlur={(e) => {
                                                                    if (e.target.value !== link.url) {
                                                                        handleQuickUpdate(link._id, { url: e.target.value });
                                                                    }
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        (e.target as HTMLInputElement).blur();
                                                                    }
                                                                }}
                                                            />
                                                            <div
                                                                onClick={() => {
                                                                    const input = (document.activeElement as HTMLInputElement);
                                                                    if (input && input.value !== link.url) {
                                                                        handleQuickUpdate(link._id, { url: input.value });
                                                                    }
                                                                }}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/input:opacity-100 transition-opacity cursor-pointer"
                                                            >
                                                                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                                                                    <Check size={14} strokeWidth={3} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                    }

                    {
                        activeSection === 'security' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold mb-6">Security Settings</h3>

                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-4 items-start mb-6">
                                    <Shield className="text-emerald-400 shrink-0 mt-1" size={20} />
                                    <div>
                                        <h5 className="font-bold text-emerald-400">Two-Factor Authentication</h5>
                                        <p className="text-sm text-emerald-400/80 mt-1">We recommend enabling 2FA for added account security.</p>
                                    </div>
                                    <div className="ml-auto flex flex-col items-end gap-1">
                                        <button
                                            disabled
                                            className="bg-emerald-500/10 text-emerald-500/40 text-[10px] px-3 py-1.5 rounded-lg font-bold border border-emerald-500/20 cursor-not-allowed uppercase tracking-widest"
                                        >
                                            Enable
                                        </button>
                                        <span className="text-[10px] text-emerald-400/60 font-medium uppercase tracking-tighter">Coming Soon</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/60 mb-2">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors pr-10"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                            >
                                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-2">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors pr-10"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                                >
                                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-2">Confirm New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors pr-10"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex justify-end">
                                    <button
                                        onClick={handlePasswordUpdate}
                                        disabled={isLoading}
                                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all border border-white/10 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </motion.div>
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmDeleteSocial}
                title={confirmModal.title}
                message={confirmModal.message}
                isDestructive={true}
                confirmText="Delete"
            />
        </div>
    );
};

export default Settings;
