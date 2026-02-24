'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/utils/api';

const AdminLogin = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data: any = await api.post('/users/login', { email, password });

            // On success, store the access token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                name: data.name,
                email: data.email,
                role: data.role
            }));

            // Notify user of success
            console.log('Login successful for:', data.name);
            router.replace('/admin/dashboard');
        } catch (err: any) {
            console.error('Login attempt failed:', err);

            let errorMessage = 'Invalid credentials. Access denied.';

            if (typeof err === 'string') {
                if (err.includes('401')) {
                    errorMessage = 'Invalid email or password. Please try again.';
                } else if (err.includes('404')) {
                    errorMessage = 'Login service not found. Please contact support.';
                } else if (err.includes('500') || err.includes('Server Error')) {
                    errorMessage = 'System error. Please try again later.';
                } else {
                    errorMessage = err;
                }
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">

            {/* Back to Home Link */}
            <Link href="/" className="absolute top-8 left-8 text-white/40 hover:text-emerald-400 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all z-50 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                BACK TO HOME
            </Link>

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Security Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 shadow-2xl">
                        <ShieldCheck className="text-emerald-500 w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Admin Portal</h1>
                    <p className="text-white/40 text-sm font-medium uppercase tracking-widest flex items-center justify-center gap-2">
                        <Lock size={12} /> Authorized Personnel Only
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden group">

                    {/* Subtle top glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10" autoComplete="off">
                        {/* 
                          Honey-pot inputs to trick browser autofill. 
                          Browsers usually target the first visible/enabled inputs. 
                        */}
                        <div className="absolute opacity-0 -z-50 pointer-events-none h-0 w-0 overflow-hidden">
                            <input type="text" name="email_placeholder" tabIndex={-1} />
                            <input type="password" name="password_placeholder" tabIndex={-1} />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-xs flex items-center gap-2"
                            >
                                <AlertCircle size={14} />
                                {error}
                            </motion.div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Email Access ID</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-emerald-500/80 group-focus-within/input:text-emerald-400 transition-colors z-10" />
                                <input
                                    type="email"
                                    name="user_email_identity"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="off"
                                    onFocus={(e) => e.target.removeAttribute('readOnly')}
                                    readOnly
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all relative z-0 caret-emerald-500 dark-input"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center pl-1 pr-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Secure Key</label>
                            </div>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-emerald-500/80 group-focus-within/input:text-emerald-400 transition-colors z-10" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="user_secure_credential"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    onFocus={(e) => e.target.removeAttribute('readOnly')}
                                    readOnly
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all relative z-0 caret-emerald-500 dark-input"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-emerald-500/80 hover:text-emerald-400 transition-colors focus:outline-none z-10"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 mt-2 rounded-xl uppercase tracking-widest text-xs bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transform hover:scale-[1.02] active:scale-[0.98] font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group/btn"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                <>
                                    Sign In to System <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-[10px] text-white/20 font-mono">
                            SECURE CONNECTION • 256-BIT ENCRYPTION
                        </p>
                    </div>
                </div>

                <p className="text-center text-white/20 text-xs mt-8">
                    &copy; {new Date().getFullYear()} ProHostix Internal System. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
