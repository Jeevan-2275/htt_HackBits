'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    router.push('/');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Campaigns', href: '/dashboard/campaigns', icon: '🎯' },
    { label: 'Testimonials', href: '/dashboard/testimonials', icon: '🎥' },
  ];

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-slate-900 border border-white/10 rounded-lg hover:bg-slate-800 transition"
      >
        <svg className="w-6 h-6 text-white/100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar - Frosted Glass Column */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-950/75 backdrop-blur-2xl border-r border-white/10 shadow-2xl flex flex-col z-40 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0 -translate-x-full md:translate-x-0 md:w-64'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 p-6 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 border border-white/20">
            <span className="text-white font-extrabold text-lg">F</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg tracking-tight">Feedspace</h2>
            <p className="text-purple-300/80 text-xs font-semibold">AI Video Studio</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-250 ${
                isActive(item.href)
                  ? 'glass-btn-primary text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'
              }`}
            >
              <span className={`text-xl transition-transform duration-250 ${!isActive(item.href) && 'group-hover:scale-110'}`}>{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
              {isActive(item.href) && (
                <span className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse shadow-sm shadow-white"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="group w-full px-4 py-3 glass-btn text-red-400 hover:text-red-300 rounded-xl font-medium transition-all duration-250 flex items-center gap-2 justify-center cursor-pointer border-red-500/20 hover:border-red-500/40 active:scale-95 text-sm">
            <svg className="w-5 h-5 transition-transform duration-250 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
