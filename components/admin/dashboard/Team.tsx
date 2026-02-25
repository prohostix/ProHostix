'use client';

import React, { useState } from 'react';
import { Mail, Briefcase, Plus, UserCheck, RefreshCcw, X, Shield, ShieldCheck, Edit2, Trash2 } from 'lucide-react';
import api from '@/utils/api';
import { useTeam } from '@/hooks/usePageData';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const Team = () => {
    const { data: team = [], isLoading, isFetching, refetch } = useTeam();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Administrator'
    });

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: null as string | null,
        title: '',
        message: ''
    });

    const getStoredUser = () => {
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('user') || '{}');
        }
        return {};
    };

    const storedUser = getStoredUser();
    const isAdmin = storedUser.role?.toLowerCase() === 'administrator';

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', role: 'Administrator' });
        setShowInviteModal(false);
        setShowEditModal(false);
        setSelectedMember(null);
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading('Inviting member...');
        try {
            await api.post('/users/register', formData);
            refetch();
            resetForm();
            toast.success('Member invited successfully', { id: toastId });
        } catch (error: any) {
            console.error('Failed to invite member:', error);
            const msg = error.response?.data?.message || 'Failed to invite member';
            toast.error(msg, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateRole = async (memberId: string, newRole: string) => {
        const toastId = toast.loading('Updating role...');
        try {
            await api.put(`/users/${memberId}`, { role: newRole });
            refetch();
            toast.success('Role updated successfully', { id: toastId });
            // Update selected member local state if needed OR just close modal after success
            // For now, let's keep the modal open? Or close it.
            // But setSelectedMember is used for the modal.
            // Maybe best to just refetch.
        } catch (error) {
            console.error('Failed to update role:', error);
            toast.error('Failed to update role', { id: toastId });
        }
    };

    const requestDeleteUser = (memberId: string) => {
        setConfirmModal({
            isOpen: true,
            id: memberId,
            title: 'Remove Team Member?',
            message: 'Are you sure you want to remove this team member? This action cannot be undone.'
        });
    };

    const handleConfirmDeleteUser = async () => {
        if (!confirmModal.id) return;
        const toastId = toast.loading('Removing member...');
        try {
            await api.delete(`/users/${confirmModal.id}`);
            refetch();
            toast.success('Member removed', { id: toastId });
        } catch (error: any) {
            console.error('Failed to delete user:', error);
            const msg = error.response?.data?.message || 'Failed to delete user';
            toast.error(msg, { id: toastId });
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
                <h2 className="text-xl font-bold">Team Members</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="p-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl transition-all border border-white/5 disabled:opacity-50"
                        title="Force Refresh Data"
                    >
                        <RefreshCcw size={18} className={isFetching ? 'animate-spin' : ''} />
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded-xl transition-all border border-emerald-500/20"
                        >
                            <Plus size={18} />
                            Invite Member
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-zinc-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-white/60">
                        <thead className="bg-white/5 text-white/40 font-medium uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(team as any[]).map((member) => (
                                <tr key={member._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-900 flex items-center justify-center font-bold text-white text-xs">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{member.name}</div>
                                                <div className="text-xs text-white/40">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white">
                                        <div className="flex items-center gap-2">
                                            <Briefcase size={14} className="text-emerald-400" />
                                            {member.role || 'Administrator'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs border ${(member.status || 'Active') === 'Active'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                            {member.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {isAdmin && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedMember(member);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-emerald-400 transition-all"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => requestDeleteUser(member._id)}
                                                    className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-red-400 transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-zinc-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                <div className="relative z-10 flex gap-4 items-start">
                    <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-2">Role Management</h4>
                        <p className="text-sm text-white/60 mb-4 max-w-xl">
                            You can invite new members and assign them specific roles. Currently, only the Administrator role has full access to settings and user management.
                        </p>
                        <button
                            onClick={() => setShowRoleModal(true)}
                            className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            Learn about roles &rarr;
                        </button>
                    </div>
                </div>
            </div>

            {/* INVITE MODAL */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-xl">
                    <div className="bg-zinc-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl w-full max-w-md shadow-22xl flex flex-col text-left overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-zinc-800/80 backdrop-blur-2xl z-10">
                            <div>
                                <h3 className="text-lg font-bold uppercase tracking-tight">Invite Team Member</h3>
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-0.5 font-bold">Access Control</p>
                            </div>
                            <button onClick={resetForm} className="text-white/40 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleInvite} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-1">Full_Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-1">Email_Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm"
                                    placeholder="john@prohostix.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-1">Initial_Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-1">Access_Level</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm appearance-none"
                                >
                                    <option value="Administrator">Administrator</option>
                                    <option value="Editor">Editor</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl text-white/60 hover:bg-white/5 transition-all text-sm">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-emerald-500 text-black rounded-xl hover:bg-emerald-600 font-semibold transition-all disabled:opacity-50 text-sm">
                                    {isSubmitting ? 'Sending Request...' : 'Send Invitation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ROLE INFO MODAL */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-xl">
                    <div className="bg-zinc-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl w-full max-w-lg shadow-22xl flex flex-col text-left overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-zinc-800/80 backdrop-blur-2xl z-10">
                            <div>
                                <h3 className="text-lg font-bold uppercase tracking-tight">Role Definitions</h3>
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-0.5 font-bold">System Documentation</p>
                            </div>
                            <button onClick={() => setShowRoleModal(false)} className="text-white/40 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex gap-4">
                                <div className="p-2 h-fit bg-emerald-500/20 rounded-lg text-emerald-400">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Administrator</h4>
                                    <p className="text-xs text-white/50 leading-relaxed">Full access to all system modules, including team management, settings, content creation, and database deletion. Intended for owners and lead engineers.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-2 h-fit bg-blue-500/20 rounded-lg text-blue-400">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Editor</h4>
                                    <p className="text-xs text-white/50 leading-relaxed">Can create, update, and delete blogs, services, and solutions. Cannot access team management or high-level system settings.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                            <button onClick={() => setShowRoleModal(false)} className="text-xs text-emerald-400 uppercase tracking-widest">Understood</button>
                        </div>
                    </div>
                </div>
            )}
            {/* EDIT ROLE MODAL */}
            {showEditModal && selectedMember && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-xl">
                    <div className="bg-zinc-800/80 backdrop-blur-2xl border border-white/20 rounded-2xl w-full max-w-md shadow-22xl flex flex-col text-left overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-zinc-800/80 backdrop-blur-2xl">
                            <div>
                                <h3 className="text-lg font-bold uppercase tracking-tight">Edit Member Role</h3>
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-0.5 font-bold">{selectedMember.name}</p>
                            </div>
                            <button onClick={resetForm} className="text-white/40 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-1">Access_Level</label>
                                <select
                                    value={selectedMember.role}
                                    onChange={(e) => handleUpdateRole(selectedMember._id, e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm appearance-none"
                                >
                                    <option value="Administrator">Administrator</option>
                                    <option value="Editor">Editor</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={resetForm} className="px-6 py-2 bg-emerald-500 text-black rounded-xl hover:bg-emerald-600 font-semibold transition-all text-sm">
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmDeleteUser}
                title={confirmModal.title}
                message={confirmModal.message}
                isDestructive={true}
                confirmText="Remove Member"
            />
        </div>
    );
};

export default Team;
