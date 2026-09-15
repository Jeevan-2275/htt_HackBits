'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setFormData({ email: 'testuser@example.com', password: 'password123' });
    setError('');
    setDemoLoading(true);

    try {
      const result = await login('testuser@example.com', 'password123');
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Demo login failed.');
      }
    } catch (err) {
      setError('Could not connect to demo server. Check backend status.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Chromatic Ambient Refraction Glows */}
      <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[520px] h-[520px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
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

        {/* Frosted Glassmorphism Login Card */}
        <div className="glass-morphism rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Top Specular Glare Accent */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-slate-400 text-sm mt-1">Sign in to your AI Video Studio</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold glass-pill text-cyan-300 border border-cyan-500/30">
              v2.5 Pro
            </span>
          </div>

          {/* 1-Click Quick Demo Login Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={demoLoading || loading}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:via-purple-500/30 hover:to-pink-500/30 border border-cyan-400/40 hover:border-cyan-300 text-cyan-200 hover:text-white font-semibold text-sm transition-all duration-250 flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-900/20 cursor-pointer active:scale-98"
            >
              <span className="text-lg animate-bounce">⚡</span>
              <span>{demoLoading ? 'Logging into Demo...' : '1-Click Quick Demo Login'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-1.5">
              Auto-fills <code className="text-cyan-300">testuser@example.com</code> with instant access
            </p>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-white/10"></div>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">or sign in with email</span>
            <div className="flex-1 h-[1px] bg-white/10"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-500/15 border border-red-500/40 rounded-xl text-red-300 text-sm flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 glass-input rounded-xl text-slate-100 placeholder-slate-500 text-sm"
                placeholder="you@company.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition">
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 glass-input rounded-xl text-slate-100 placeholder-slate-500 text-sm"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || demoLoading}
              className="w-full py-3.5 mt-2 rounded-xl glass-btn-primary text-white font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard →'}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center border-t border-white/10 pt-5">
            <p className="text-slate-400 text-xs">
              Don't have an account?{' '}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>

        {/* Enterprise Security Signals */}
        <div className="mt-8 flex items-center justify-center gap-6 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>🔒</span>
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🛡️</span>
            <span>SOC-2 Compliant Auth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🤖</span>
            <span>Groq LLaMA 3.3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
