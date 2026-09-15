'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    industry: '',
    customIndustry: '',
    email: '',
    password: '',
  });

  const industries = ['SaaS / AI', 'E-commerce & Retail', 'Healthcare & Biotech', 'Education / EdTech', 'FinTech & Banking', 'Agency / Consulting', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (formData.industry === 'Other' && !formData.customIndustry.trim()) {
      newErrors.customIndustry = 'Please specify your industry';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (validateForm()) {
      setLoading(true);
      try {
        const result = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.companyName
        );

        if (result.success) {
          router.push('/dashboard');
        } else {
          setServerError(result.error || 'Registration failed');
        }
      } catch (err) {
        setServerError('An error occurred during registration. Please try again.');
        console.error('Signup error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Refraction Glows */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 border border-white/25 group-hover:scale-105 transition-transform duration-250">
              <span className="text-white font-extrabold text-xl">F</span>
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              Feedspace<span className="text-cyan-400">.ai</span>
            </span>
          </Link>
        </div>

        {/* Frosted Glassmorphism Card */}
        <div className="glass-morphism rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Top Specular Glare Accent */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Start Your AI Video Engine
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Collect, transcribe, and edit viral reels automatically
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold glass-pill text-emerald-300 border border-emerald-500/30">
              Free 14-Day Pro
            </span>
          </div>

          {/* Server Error Message */}
          {serverError && (
            <div className="mb-6 p-3.5 bg-red-500/15 border border-red-500/40 rounded-xl text-red-300 text-sm flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass-input rounded-xl text-slate-100 placeholder-slate-500 text-sm"
                  placeholder="Sarah Connor"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass-input rounded-xl text-slate-100 placeholder-slate-500 text-sm"
                  placeholder="Acme Technologies"
                />
                {errors.companyName && <p className="text-red-400 text-xs mt-1">{errors.companyName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Industry */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Industry *
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass-input rounded-xl text-slate-100 text-sm cursor-pointer"
                >
                  <option value="" className="bg-slate-900 text-slate-400">Select Industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind} className="bg-slate-900 text-slate-100">
                      {ind}
                    </option>
                  ))}
                </select>
                {errors.industry && <p className="text-red-400 text-xs mt-1">{errors.industry}</p>}
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Work Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass-input rounded-xl text-slate-100 placeholder-slate-500 text-sm"
                  placeholder="sarah@acme.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Custom Industry (conditional) */}
            {formData.industry === 'Other' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Specify Industry *
                </label>
                <input
                  type="text"
                  name="customIndustry"
                  value={formData.customIndustry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass-input rounded-xl text-slate-100 placeholder-slate-500 text-sm"
                  placeholder="e.g. Clean Energy"
                />
                {errors.customIndustry && <p className="text-red-400 text-xs mt-1">{errors.customIndustry}</p>}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password (min. 6 characters) *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 glass-input rounded-xl text-slate-100 placeholder-slate-500 text-sm"
                placeholder="••••••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 rounded-xl glass-btn-primary text-white font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
            >
              {loading ? 'Creating Enterprise Account...' : 'Create Account & Launch Studio →'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center border-t border-white/10 pt-5">
            <p className="text-slate-400 text-xs">
              Already have an account?{' '}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Pro Tier Inclusions */}
        <div className="mt-6 glass-pill p-4 rounded-2xl flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Groq LLaMA 3.3 70B</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Free Edge TTS Neural Audio</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Unlimited 9:16 FFmpeg Reels</span>
          </div>
        </div>
      </div>
    </div>
  );
}
