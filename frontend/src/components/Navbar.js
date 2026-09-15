'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide navbar on dashboard and protected routes
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login') || pathname?.startsWith('/signup')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 glass-dock">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group" aria-label="Feedspace Home">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-105 transition duration-300 border border-white/20">
                <span className="text-white font-extrabold text-lg tracking-wider">F</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl text-white tracking-tight flex items-center gap-1.5">
                  Feedspace
                  <span className="px-1.5 py-0.5 text-[10px] uppercase font-black tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-md backdrop-blur-md">
                    AI
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:inline">
                  Viral Testimonials Engine
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Frosted Glass Island */}
          <nav className="hidden md:flex items-center gap-6 glass-pill px-6 py-2.5 rounded-full border border-white/10 shadow-lg" aria-label="Main Navigation">
            <Link href="#features" className="text-slate-300 hover:text-white font-medium text-sm transition duration-200">
              Features
            </Link>
            <Link href="#how-it-works" className="text-slate-300 hover:text-white font-medium text-sm transition duration-200">
              How It Works
            </Link>
            <Link href="#interactive-demo" className="text-slate-300 hover:text-white font-medium text-sm transition duration-200 flex items-center gap-1.5">
              <span>Studio Demo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            </Link>
            <Link href="#faq" className="text-slate-300 hover:text-white font-medium text-sm transition duration-200">
              FAQ
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" id="nav-signin-btn">
              <button className="px-5 py-2 glass-btn rounded-xl text-slate-200 hover:text-white font-semibold text-sm cursor-pointer">
                Sign In
              </button>
            </Link>
            <Link href="/signup" id="nav-get-started-btn">
              <button className="px-6 py-2.5 glass-btn-primary text-white font-bold text-sm rounded-xl cursor-pointer">
                Start Free ✨
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-slate-200 focus:outline-none transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-2 bg-black/40 backdrop-blur-sm">
            <Link
              href="#features"
              className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg font-medium text-sm transition"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg font-medium text-sm transition"
            >
              How It Works
            </Link>
            <div className="pt-2 space-y-2 border-t border-white/10">
              <Link href="/login" className="block cursor-pointer">
                <button className="w-full px-4 py-2 text-white/80 hover:text-white font-semibold hover:bg-white/10 rounded-lg transition cursor-pointer">
                  Sign In
                </button>
              </Link>
              <Link href="/signup" className="block cursor-pointer">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer active:scale-95">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
