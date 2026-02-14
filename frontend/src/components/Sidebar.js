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
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition"
      >
        <svg className="w-6 h-6 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 flex flex-col z-40 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0 -translate-x-full md:translate-x-0 md:w-64'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h2 className="text-slate-100 font-bold text-lg">Feedspace</h2>
            <p className="text-slate-500 text-xs">AI Testimonials</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300 ${
                isActive(item.href)
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-medium transition duration-300 flex items-center gap-2 justify-center cursor-pointer">
            <span>🚪</span>
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
