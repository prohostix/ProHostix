'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Upload,
    X,
    Save,
    Loader2,
    ExternalLink,
    Eye,
    EyeOff,
    GripVertical,
    Building2
} from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'react-hot-toast';

interface Client {
    _id: string;
    name: string;
    logo: string;
    website?: string;
    order: number;
    active: boolean;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export default function Clients() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        website: '',
        order: 0,
        active: true,
        description: ''
    });

    // Set ready state after mount
    React.useEffect(() => {
        setIsReady(true);
    }, []);

    // Fetch clients
    const { data: clients, isLoading, error } = useQuery({
        queryKey: ['admin', 'clients'],
        queryFn: async () => {
            try {
                // api.get returns data directly due to interceptor
                const data = await api.get('/clients');
                console.log('Clients API raw response:', data, 'Type:', typeof data, 'IsArray:', Array.isArray(data));
                
                // Ensure we always return an array
                if (data === undefined || data === null) {
                    console.error('API returned undefined/null, returning empty array');
                    return [];
                }
                
                if (Array.isArray(data)) {
                    console.log('Returning array with', data.length, 'clients');
                    return data;
                }
                
                console.error('API returned non-array data:', typeof data, data);
                return [];
            } catch (err) {
                console.error('Error fetching clients:', err);
                // Return empty array on error instead of throwing
                return [];
            }
        },
        enabled: isReady, // Only run query when component is ready
        retry: false,
        staleTime: 30000,
        // Provide initial data
        initialData: []
    });

    // Ensure clients is always an array
    const safeClients = Array.isArray(clients) ? clients : [];

    // Create client mutation
    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            // api.post returns data directly due to interceptor
            return await api.post('/clients', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
            toast.success('Client added successfully');
            closeModal();
        },
        onError: (error: any) => {
            toast.error(error || 'Failed to add client');
        }
    });

    // Update client mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            // api.put returns data directly due to interceptor
            return await api.put(`/clients/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
            toast.success('Client updated successfully');
            closeModal();
        },
        onError: (error: any) => {
            toast.error(error || 'Failed to update client');
        }
    });

    // Delete client mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/clients/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
            toast.success('Client deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error || 'Failed to delete client');
        }
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            // api.post returns data directly due to interceptor
            const data = await api.post('/upload/client-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }) as any;

            setFormData(prev => ({ ...prev, logo: data.imageUrl }));
            toast.success('Logo uploaded successfully');
        } catch (error: any) {
            toast.error(error || 'Failed to upload logo');
        } finally {
            setUploading(false);
        }
    };

    const openModal = (client?: Client) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                name: client.name,
                logo: client.logo,
                website: client.website || '',
                order: client.order,
                active: client.active,
                description: client.description || ''
            });
        } else {
            setEditingClient(null);
            setFormData({
                name: '',
                logo: '',
                website: '',
                order: safeClients.length,
                active: true,
                description: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingClient(null);
        setFormData({
            name: '',
            logo: '',
            website: '',
            order: 0,
            active: true,
            description: ''
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.logo) {
            toast.error('Name and logo are required');
            return;
        }

        if (editingClient) {
            updateMutation.mutate({ id: editingClient._id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this client?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Top Clients</h1>
                    <p className="text-white/40 text-sm mt-1">Manage client logos displayed on the homepage</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors"
                >
                    <Plus size={18} />
                    Add Client
                </button>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeClients.map((client: Client) => (
                    <motion.div
                        key={client._id}
                        layout
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
                                    {client.logo ? (
                                        <img
                                            src={client.logo}
                                            alt={client.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building2 size={24} className="text-white/40" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{client.name}</h3>
                                    <span className={`text-xs ${client.active ? 'text-emerald-400' : 'text-white/40'}`}>
                                        {client.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openModal(client)}
                                    className="p-2 text-white/40 hover:text-emerald-400 transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(client._id)}
                                    className="p-2 text-white/40 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {client.description && (
                            <p className="text-sm text-white/60 mb-3 line-clamp-2">{client.description}</p>
                        )}

                        {client.website && (
                            <a
                                href={client.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                            >
                                Visit Website
                                <ExternalLink size={12} />
                            </a>
                        )}

                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                            <span>Order: {client.order}</span>
                            <span>{new Date(client.createdAt).toLocaleDateString()}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {safeClients.length === 0 && (
                <div className="text-center py-12 text-white/40">
                    <Building2 size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No clients added yet. Click "Add Client" to get started.</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-8 max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-black mb-6">
                                {editingClient ? 'Edit Client' : 'Add New Client'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Logo Upload */}
                                <div>
                                    <label className="block text-sm font-bold mb-2">Logo *</label>
                                    <div className="flex items-center gap-4">
                                        {formData.logo && (
                                            <div className="w-24 h-24 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={formData.logo}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        )}
                                        <label className="flex-1 cursor-pointer">
                                            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/50 transition-colors">
                                                {uploading ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    <Upload size={18} />
                                                )}
                                                <span className="text-sm font-bold">
                                                    {uploading ? 'Uploading...' : 'Upload Logo'}
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-bold mb-2">Client Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                                        placeholder="e.g., Acme Corporation"
                                        required
                                    />
                                </div>

                                {/* Website */}
                                <div>
                                    <label className="block text-sm font-bold mb-2">Website</label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                                        placeholder="https://example.com"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                                        rows={3}
                                        placeholder="Brief description about the client..."
                                    />
                                </div>

                                {/* Order & Active */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Display Order</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Status</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, active: !formData.active })}
                                            className={`w-full px-4 py-3 rounded-xl font-bold transition-colors ${
                                                formData.active
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                    : 'bg-white/5 text-white/40 border border-white/10'
                                            }`}
                                        >
                                            {formData.active ? 'Active' : 'Inactive'}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                        className="flex-1 px-4 py-3 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {(createMutation.isPending || updateMutation.isPending) ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                {editingClient ? 'Update' : 'Create'}
                                            </>
                                        )}
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
