'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, User, Mail, Briefcase, FileText, AlertCircle, Phone, Globe } from 'lucide-react';
import api from '@/utils/api';
import { countries } from '@/config/countries';

const CareersForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        country: 'India',
        countryCode: '+91',
        phoneNumber: '',
        message: '',
        resume: null as File | null // File object
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCountryCodeChange = (e: any) => {
        const country = countries.find((c: any) => c.code === e.target.value);
        if (country) {
            setFormData(prev => ({
                ...prev,
                country: country.name,
                countryCode: country.dialCode,
                phoneNumber: '' // Clear number when country code changes
            }));
        }
    };

    const handleChange = (e: any) => {
        const { name, value, files } = e.target;
        if (name === 'resume') {
            const file = files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    setError("File size exceeds 5MB limit.");
                    return;
                }
                setFormData(prev => ({ ...prev, [name]: file }));
            }
        } else if (name === 'phoneNumber') {
            const digits = value.replace(/\D/g, '');
            const selectedCountry = countries.find((c: any) => c.name === formData.country);
            if (selectedCountry && digits.length > selectedCountry.length) return;
            setFormData(prev => ({ ...prev, [name]: digits }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setError('');
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const selectedCountry = countries.find((c: any) => c.name === formData.country);
        if (selectedCountry && formData.phoneNumber && formData.phoneNumber.length !== selectedCountry.length) {
            setIsSubmitting(false);
            setError(`Please enter a valid ${selectedCountry.length}-digit phone number for ${selectedCountry.name}.`);
            return;
        }

        // Explicit validation for all fields
        const requiredFields = ['name', 'email', 'role', 'phoneNumber', 'message'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

        if (missingFields.length > 0) {
            setIsSubmitting(false);
            setError("Please fill in all required fields.");
            return;
        }

        // Specific Validations
        if (formData.name.trim().length < 2) {
            setIsSubmitting(false);
            setError("Please enter a valid full name.");
            return;
        }
        if (formData.name.length > 60) {
            setIsSubmitting(false);
            setError("Name cannot exceed 60 characters.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setIsSubmitting(false);
            setError("Please enter a valid work email address.");
            return;
        }

        if (formData.message.trim().length < 20) {
            setIsSubmitting(false);
            setError("Please provide a more detailed description (at least 20 characters).");
            return;
        }
        if (formData.message.length > 2000) {
            setIsSubmitting(false);
            setError("Message cannot exceed 2000 characters.");
            return;
        }

        if (!formData.resume) {
            setIsSubmitting(false);
            setError("Please upload your Resume / CV.");
            return;
        }

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('role', formData.role);
            data.append('country', formData.country);
            data.append('countryCode', formData.countryCode);
            data.append('phoneNumber', formData.phoneNumber);
            data.append('message', formData.message);
            data.append('resume', formData.resume as Blob);

            await api.post('/enquiries/careers', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsSubmitting(false);
            setIsSuccess(true);
            setFormData({
                name: '', email: '', role: '',
                country: 'India', countryCode: '+91', phoneNumber: '',
                message: '', resume: null
            });
        } catch (err) {
            console.error(err);
            setIsSubmitting(false);
            setError(typeof err === 'string' ? err : 'Failed to submit application. Please try again.');
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]"
            >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                    <CheckCircle2 className="text-emerald-500 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Application Sent</h3>
                <p className="text-white/60 mb-6 max-w-sm">
                    Thank you for your interest in ProHostix. Our recruitment team will review your profile and get in touch shortly.
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:border-emerald-500/50 text-white/40 hover:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                >
                    BACK TO FORM
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors z-10" />
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            maxLength={60}
                            className="w-full h-[48px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Work Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors z-10" />
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="w-full h-[48px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Phone Number - Single Line */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Phone Number</label>
                    <div className="flex gap-2">
                        <div className="relative group w-[110px] shrink-0">
                            {/* Visual Overlay for selected value */}
                            <div className="absolute inset-0 flex items-center px-4 text-white font-bold pointer-events-none z-0 text-sm">
                                <Globe className="w-4 h-4 mr-2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                                <span>{formData.countryCode}</span>
                            </div>

                            <select
                                value={countries.find((c: any) => c.name === formData.country)?.code || 'IN'}
                                onChange={handleCountryCodeChange}
                                className="w-full h-[48px] bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 text-transparent focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer font-bold text-sm relative z-10"
                            >
                                {countries.map((c: any, i: number) => (
                                    <option key={i} value={c.code} className="bg-neutral-900 text-white">
                                        {c.flag} {c.name} ({c.dialCode})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-r border-b border-white/30 rotate-45 pointer-events-none group-focus-within:border-emerald-400 transition-colors z-20"></div>
                        </div>

                        <div className="relative flex-grow group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors z-10" />
                            <input
                                type="tel"
                                name="phoneNumber"
                                required
                                autoComplete="off"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder=""
                                className="w-full h-[48px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono tracking-wider font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Role of Interest */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Role of Interest</label>
                    <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors z-10" />
                        <select
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full h-[48px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-10 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer font-medium"
                        >
                            <option value="" disabled className="bg-neutral-900 text-white/50">Select Role</option>
                            <option value="Engineering" className="bg-neutral-900">Engineering</option>
                            <option value="Design" className="bg-neutral-900">Design</option>
                            <option value="Product" className="bg-neutral-900">Product</option>
                            <option value="Other" className="bg-neutral-900">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-white/30 rotate-45 pointer-events-none group-focus-within:border-emerald-400 transition-colors"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Resume / CV (PDF)</label>
                    <div className="relative group bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all overflow-hidden h-[48px]">
                        <input
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={handleChange}
                            className="opacity-0 w-full h-full absolute inset-0 cursor-pointer z-10"
                        />
                        <div className="flex items-center gap-3 h-full pl-4 pr-10">
                            <div className="p-1 bg-emerald-500/20 rounded-lg text-emerald-400 flex items-center justify-center">
                                <FileText size={16} />
                            </div>
                            <div className="flex-1 truncate">
                                <span className={formData.resume ? "text-emerald-400 text-sm font-medium" : "text-white/40 text-sm"}>
                                    {formData.resume ? (formData.resume as File).name : "Upload Resume (PDF, DOC)"}
                                </span>
                            </div>
                            {formData.resume && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Why ProHostix?</label>
                <div className="relative group">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors z-10" />
                    <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        maxLength={2000}
                        placeholder="Tell us a bit about your journey..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all resize-none font-medium"
                    />
                    <div className="absolute right-3 bottom-2 text-[10px] text-white/20 font-mono">
                        {formData.message.length} / 2000
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    <AlertCircle size={16} />
                    <p>{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 mt-4 rounded-xl font-bold uppercase tracking-widest text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        Submit Application <Send size={18} />
                    </>
                )}
            </button>

            <p className="text-center text-white/30 text-[10px] mt-4">
                We value diversity and technical excellence over everything else.
            </p>
        </form>
    );
};

export default CareersForm;
