'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import campaignService from '@/lib/campaignService';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        const campaignData = await campaignService.getCampaigns();
        setCampaigns(campaignData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, authLoading]);

  // Calculate real stats from campaigns
  const stats = [
    { 
      label: 'Total Campaigns', 
      value: campaigns.length.toString(), 
      icon: '🎯', 
      color: 'from-blue-500' 
    },
    { 
      label: 'Total Testimonials', 
      value: campaigns.reduce((sum, c) => sum + (c.testimonialCount || 0), 0).toString(), 
      icon: '🎥', 
      color: 'from-purple-500' 
    },
    { 
      label: 'Active Campaigns', 
      value: campaigns.filter(c => c.status === 'active').length.toString(), 
      icon: '✅', 
      color: 'from-emerald-500' 
    },
  ];

  const recentCampaigns = campaigns.slice(0, 3);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center animate-pulse mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-indigo-900/10 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header - with real user name */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-100 mb-2 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-slate-400 text-lg">Here's what's happening with your testimonials today</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Stats Grid - with real data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl transition-all duration-300"
            >
              {/* Gradient Border Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative bg-slate-900/60 backdrop-blur-md border border-white/10/50 rounded-xl p-6 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 transition duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-slate-100">{stat.value}</p>
                  </div>
                  <div className={`text-3xl bg-gradient-to-br ${stat.color} to-transparent p-3 rounded-lg min-w-16 text-center shadow-lg shadow-purple-500/10`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Campaigns */}
          <div className="group bg-slate-900/60 backdrop-blur-md border border-white/10/50 rounded-xl p-6 shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition duration-300">
            <h2 className="text-xl font-bold text-slate-100 mb-6">Recent Campaigns</h2>
            {recentCampaigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No campaigns yet</p>
                <Link href="/dashboard/campaigns/create" className="text-blue-400 hover:text-blue-300 text-sm mt-2">
                  Create your first campaign
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign._id} className="flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition duration-300 border border-white/10/30 hover:border-slate-700/50">
                    <div className="flex-1">
                      <p className="text-slate-100 font-medium">{campaign.name}</p>
                      <p className="text-slate-500 text-sm">{campaign.testimonialCount || 0} testimonials collected</p>
                    </div>
                    <div className="text-slate-400 text-sm">
                      {formatDate(campaign.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* Activity Stats */}
        <div className="group bg-slate-900/60 backdrop-blur-md border border-white/10/50 rounded-xl p-6 shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition duration-300 mt-6">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Campaign Status Overview</h2>
          <div className="space-y-5">
            {campaigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">Create campaigns to see statistics</p>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm font-medium">Active Campaigns</span>
                    <span className="text-slate-100 font-bold">{campaigns.filter(c => c.status === 'active').length}</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full shadow-lg shadow-emerald-500/30" 
                      style={{ width: campaigns.length > 0 ? `${(campaigns.filter(c => c.status === 'active').length / campaigns.length) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm font-medium">Archived</span>
                    <span className="text-slate-100 font-bold">{campaigns.filter(c => c.status === 'archived').length}</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-amber-600 h-2.5 rounded-full shadow-lg shadow-yellow-500/30" 
                      style={{ width: campaigns.length > 0 ? `${(campaigns.filter(c => c.status === 'archived').length / campaigns.length) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm font-medium">Draft</span>
                    <span className="text-slate-100 font-bold">{campaigns.filter(c => c.status === 'draft').length}</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2.5 rounded-full shadow-lg shadow-blue-500/30" 
                      style={{ width: campaigns.length > 0 ? `${(campaigns.filter(c => c.status === 'draft').length / campaigns.length) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        </div>

        {/* Quick Action */}
        <div className="mt-10 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-100 mb-2">Ready to Collect More Testimonials?</h3>
          <p className="text-slate-400 mb-6">Create a new campaign and start gathering video testimonials from your customers.</p>
          <Link href="/dashboard/campaigns/create" className="inline-block">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Campaign
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
