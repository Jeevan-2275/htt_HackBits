'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTestimonials } from '@/lib/mockApi';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
        setFilteredTestimonials(data);
      } catch (error) {
        console.error('Failed to load testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  useEffect(() => {
    let filtered = testimonials;

    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    setFilteredTestimonials(filtered);
  }, [searchTerm, statusFilter, testimonials]);

  const getStatusColor = (status) => {
    if (status === 'Completed') {
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
    return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
  };

  const getStatusIcon = (status) => {
    return status === 'Completed' ? '✓' : '⟳';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-12 w-64 bg-slate-800/60 rounded-lg animate-pulse mb-2"></div>
          <div className="h-5 w-48 bg-slate-800/40 rounded-lg animate-pulse"></div>
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 h-12 bg-slate-800/50 rounded-lg animate-pulse"></div>
          <div className="w-40 h-12 bg-slate-800/50 rounded-lg animate-pulse"></div>
        </div>

        {/* Testimonial Cards Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-900/60 backdrop-blur-md border border-slate-800/50 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-5 w-32 bg-slate-800/60 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-24 bg-slate-800/40 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-24 bg-slate-800/50 rounded-full animate-pulse"></div>
                    <div className="h-6 w-28 bg-slate-800/50 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 w-20 bg-slate-800/50 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-24 bg-slate-800/50 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-indigo-900/10 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">Testimonials</h1>
          <p className="text-slate-400 text-lg">View and manage all collected testimonials ({filteredTestimonials.length})</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition duration-300 focus:bg-slate-800"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition duration-300 cursor-pointer focus:bg-slate-800"
          >
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
          </select>
        </div>

        {/* Empty State */}
        {filteredTestimonials.length === 0 && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-slate-800/50">
                <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">+</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3">No testimonials yet</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Share your campaign link to start collecting video testimonials from your customers</p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer">
              Create First Campaign
            </button>
          </div>
        )}

        {/* Testimonials List */}
        {filteredTestimonials.length > 0 && (
          <div className="space-y-4">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="group bg-slate-900/60 backdrop-blur-md border border-slate-800/50 rounded-xl p-6 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 transition duration-300"
              >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {testimonial.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-slate-100 font-bold text-lg">{testimonial.customerName}</h3>
                      <p className="text-slate-400 text-sm">{testimonial.campaignName}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {/* Status Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(testimonial.status)}`}>
                      {getStatusIcon(testimonial.status)} {testimonial.status}
                    </span>

                    {/* Date */}
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-800/50 text-slate-400 border border-slate-700/50">
                      📅 {formatDate(testimonial.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex gap-3">
                  {testimonial.status === 'Completed' && (
                    <>
                      <Link href={`/dashboard/testimonials/${testimonial.id}`} className="cursor-pointer">
                        <button className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-blue-400 border border-blue-500/30 rounded-lg font-medium transition-all duration-300 whitespace-nowrap cursor-pointer hover:shadow-lg hover:shadow-purple-500/20 active:scale-95">
                          View
                        </button>
                      </Link>
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg font-medium transition-all duration-300 whitespace-nowrap cursor-pointer hover:shadow-lg active:scale-95 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </>
                  )}
                  {testimonial.status === 'Processing' && (
                    <Link href={`/dashboard/testimonials/${testimonial.id}`} className="cursor-pointer">
                      <button className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-blue-400 border border-blue-500/30 rounded-lg font-medium transition duration-300 whitespace-nowrap cursor-pointer">
                        View Progress
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
