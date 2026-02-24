'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Send, CheckCircle2, User, Mail, Phone, Building2, Briefcase, FileText, Calendar, Layers, Sparkles, AlertCircle, Globe } from 'lucide-react';
import { countries } from '@/config/countries';
import { servicesContent } from '@/config/services/servicesContent';
import { solutionsContent } from '@/config/solutions/solutionsContent';
import api from '@/utils/api';

const LetsTalkForm = () => {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        role: '',
        enquiryType: '',
        enquiryItem: '',
        country: 'India',
        countryCode: '+91',
        phoneNumber: '',
        description: '',
        timeline: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Populate initial state from URL params
    useEffect(() => {
        if (!searchParams) return;
        const type = searchParams.get('type');
        const subject = searchParams.get('subject');

        if (type || subject) {
            setFormData(prev => ({
                ...prev,
                enquiryType: type || '',
                enquiryItem: subject || ''
            }));
        }
    }, [searchParams]);

    const enquiryOptions: any = {
        services: servicesContent.serviceStack.map((s: any) => s.title),
        solutions: solutionsContent.solutionPillars.map((s: any) => s.title),
        general: ["Technical Consultation", "Partnership", "Career", "Other"]
    };

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
        const { name, value } = e.target;
        setError('');

        if (name === "phoneNumber") {
            const digits = value.replace(/\D/g, '');
            const selectedCountry = countries.find((c: any) => c.name === formData.country);
            if (selectedCountry && digits.length > selectedCountry.length) return;
            setFormData(prev => ({ ...prev, [name]: digits }));
            return;
        }

        if (name === "enquiryType") {
            setFormData(prev => ({
                ...prev,
                enquiryType: value,
                enquiryItem: ''
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
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
        const requiredFields = ['name', 'email', 'company', 'role', 'enquiryType', 'enquiryItem', 'phoneNumber', 'description', 'timeline'];
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

        if (formData.company.trim().length < 2) {
            setIsSubmitting(false);
            setError("Please enter a valid company name.");
            return;
        }
        if (formData.company.length > 100) {
            setIsSubmitting(false);
            setError("Company name cannot exceed 100 characters.");
            return;
        }

        if (formData.description.trim().length < 20) {
            setIsSubmitting(false);
            setError("Please provide a more detailed project description (at least 20 characters).");
            return;
        }
        if (formData.description.length > 2000) {
            setIsSubmitting(false);
            setError("Description cannot exceed 2000 characters.");
            return;
        }

        try {
            await api.post('/enquiries', formData);
            setIsSubmitting(false);
            setIsSuccess(true);
            setFormData({
                name: '', email: '', company: '', role: '',
                enquiryType: '', enquiryItem: '',
                country: 'India', countryCode: '+91',
                phoneNumber: '',
                description: '', timeline: ''
            });
        } catch (err) {
            console.error(err);
            setIsSubmitting(false);
            setError(typeof err === 'string' ? err : 'Failed to submit enquiry. Please try again.');
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]"
            >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                    <CheckCircle2 className="text-emerald-500 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Received</h3>
                <p className="text-white/60 mb-6 max-w-sm">
                    Thank you for reaching out. Our team will review your project details and get back to you within 24 hours.
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
                >
                    Send Another Message
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Row 1: Identity */}
                <div className="space-y-2">
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
                            className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Work Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors z-10" />
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@company.com"
                            className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Row 2: Organization */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Company Name</label>
                    <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors z-10" />
                        <input
                            type="text"
                            name="company"
                            required
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Acme Inc."
                            maxLength={100}
                            className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Your Role</label>
                    <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors z-10" />
                        <select
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-10 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer font-medium"
                        >
                            <option value="" disabled className="bg-neutral-900 text-white/50">Select Role</option>
                            <option value="Founder/CEO" className="bg-neutral-900">Founder / CEO</option>
                            <option value="CTO/VP Engineering" className="bg-neutral-900">CTO / VP Engineering</option>
                            <option value="Product Manager" className="bg-neutral-900">Product Manager</option>
                            <option value="Other" className="bg-neutral-900">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-white/30 rotate-45 pointer-events-none group-focus-within:border-emerald-400 transition-colors"></div>
                    </div>
                </div>

                {/* Row 3: Interest Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Interested In</label>
                    <div className="relative group">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors z-10" />
                        <select
                            name="enquiryType"
                            required
                            value={formData.enquiryType}
                            onChange={handleChange}
                            className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-10 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer capitalize font-medium"
                        >
                            <option value="" disabled className="bg-neutral-900 text-white/50">Select Category</option>
                            <option value="services" className="bg-neutral-900">Engineering Services</option>
                            <option value="solutions" className="bg-neutral-900">Enterprise Solutions</option>
                            <option value="general" className="bg-neutral-900">General Inquiry</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-white/30 rotate-45 pointer-events-none group-focus-within:border-emerald-400 transition-colors"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Specific Item</label>
                    <div className="relative group">
                        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors z-10" />
                        <select
                            name="enquiryItem"
                            required
                            value={formData.enquiryItem}
                            onChange={handleChange}
                            disabled={!formData.enquiryType}
                            className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-10 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            <option value="" disabled className="bg-neutral-900 text-white/50">
                                {formData.enquiryType ? `Select ${formData.enquiryType.slice(0, -1)}` : "Select category first"}
                            </option>
                            {formData.enquiryType && enquiryOptions[formData.enquiryType].map((opt: any, i: number) => (
                                <option key={i} value={opt} className="bg-neutral-900">{opt}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-white/30 rotate-45 pointer-events-none group-focus-within:border-emerald-400 transition-colors"></div>
                    </div>
                </div>

                {/* Row 4: Phone (Full Width) */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Phone Number</label>
                    <div className="flex gap-2">
                        <div className="relative group w-[110px] shrink-0">
                            {/* Visual Overlay for selected value */}
                            <div className="absolute inset-0 flex items-center px-4 text-white font-bold pointer-events-none z-0">
                                <Globe className="w-4 h-4 mr-2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                                <span>{formData.countryCode}</span>
                            </div>

                            <select
                                value={countries.find((c: any) => c.name === formData.country)?.code || 'IN'}
                                onChange={handleCountryCodeChange}
                                className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 text-transparent focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer font-bold relative z-10"
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
                                className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono tracking-wider font-bold"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Expected Timeline</label>
                    <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors z-10" />
                        <select
                            name="timeline"
                            required
                            value={formData.timeline}
                            onChange={handleChange}
                            className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-10 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer font-medium"
                        >
                            <option value="" disabled className="bg-neutral-900 text-white/50">Select Timeline</option>
                            <option value="ASAP" className="bg-neutral-900">ASAP</option>
                            <option value="1-3 Months" className="bg-neutral-900">1-3 Months</option>
                            <option value="3-6 Months" className="bg-neutral-900">3-6 Months</option>
                            <option value="Flexible" className="bg-neutral-900">Flexible</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-white/30 rotate-45 pointer-events-none group-focus-within:border-emerald-400 transition-colors"></div>
                    </div>
                </div>
            </div>

            {/* Row 5: Full Width Description */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50 pl-1">Project Description</label>
                <div className="relative group">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors z-10" />
                    <textarea
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        maxLength={2000}
                        placeholder="Tell us about what you're building..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all resize-none font-medium"
                    />
                    <div className="absolute right-3 bottom-2 text-[10px] text-white/20 font-mono">
                        {formData.description.length} / 2000
                    </div>
                </div>
            </div>

            {/* Error */}
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
                        Processing...
                    </>
                ) : (
                    <>
                        Start the Conversation <Send size={18} />
                    </>
                )}
            </button>

            <p className="text-center text-white/30 text-xs mt-4">
                Structured for enterprise security. Your data is encrypted and confidential.
            </p>
        </form>
    );
};

export default LetsTalkForm;
