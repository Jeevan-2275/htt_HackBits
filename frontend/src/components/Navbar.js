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
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-xl text-slate-100 hidden sm:inline">Feedspace</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-slate-400 hover:text-blue-400 font-medium text-sm transition duration-300">
              Features
            </Link>
            <Link href="#how-it-works" className="text-slate-400 hover:text-blue-400 font-medium text-sm transition duration-300">
              How It Works
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="cursor-pointer">
              <button className="px-6 py-2 text-slate-400 hover:text-slate-100 font-semibold hover:bg-slate-800/50 rounded-lg transition duration-300 cursor-pointer">
                Sign In
              </button>
            </Link>
            <Link href="/signup" className="cursor-pointer">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105 cursor-pointer">
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
          <div className="md:hidden border-t border-slate-800/50 py-4 space-y-2 bg-slate-950/50 backdrop-blur-sm">
            <Link
              href="#features"
              className="block px-3 py-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg font-medium text-sm transition"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block px-3 py-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg font-medium text-sm transition"
            >
              How It Works
            </Link>
            <div className="pt-2 space-y-2 border-t border-slate-800/50">
              <Link href="/login" className="block cursor-pointer">
                <button className="w-full px-4 py-2 text-slate-400 hover:text-slate-100 font-semibold hover:bg-slate-800/50 rounded-lg transition cursor-pointer">
                  Sign In
                </button>
              </Link>
              <Link href="/signup" className="block cursor-pointer">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition cursor-pointer">
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
