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

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-900/80 backdrop-blur-md border-r border-white/10/50 flex flex-col z-40 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0 -translate-x-full md:translate-x-0 md:w-64'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 p-6 border-b border-white/10/50 bg-gradient-to-b from-slate-900/50 to-transparent">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h2 className="text-white/100 font-bold text-lg">Feedspace</h2>
            <p className="text-white/500 text-xs">AI Testimonials</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
                  : 'text-white/400 hover:text-white/100 hover:bg-slate-800/60 hover:translate-x-1'
              }`}
            >
              <span className={`text-xl transition-transform duration-300 ${!isActive(item.href) && 'group-hover:scale-110'}`}>{item.icon}</span>
              <span>{item.label}</span>
              {isActive(item.href) && (
                <span className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10/50">
          <button onClick={handleLogout} className="group w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 justify-center cursor-pointer border border-red-500/20 hover:border-red-500/40 active:scale-95">
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
