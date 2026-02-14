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
    <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/40">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-xl text-white hidden sm:inline">Feedspace</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-white/60 hover:text-white font-medium text-sm transition duration-300">
              Features
            </Link>
            <Link href="#how-it-works" className="text-white/60 hover:text-white font-medium text-sm transition duration-300">
              How It Works
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="cursor-pointer">
              <button className="px-6 py-2 text-white/80 hover:text-white font-semibold hover:bg-white/10 rounded-lg transition duration-300 cursor-pointer">
                Sign In
              </button>
            </Link>
            <Link href="/signup" className="cursor-pointer">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition duration-300 transform hover:scale-105 cursor-pointer">
                Get Started
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
    </nav>
  );
}
