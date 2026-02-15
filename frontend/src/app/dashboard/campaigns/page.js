'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import campaignService from '@/lib/campaignService';

export default function CampaignsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) return;

    const loadCampaigns = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await campaignService.getCampaigns();
        setCampaigns(data);
      } catch (err) {
        console.error('Failed to load campaigns:', err);
        setError(err.message || 'Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [isAuthenticated, authLoading]);

  const handleCopyLink = (campaignId) => {
    const publicLink = `${window.location.origin}/record/${campaignId}`;
    navigator.clipboard.writeText(publicLink);
    alert('Public link copied to clipboard!');
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await campaignService.deleteCampaign(campaignId);
      setCampaigns(campaigns.filter(c => c._id !== campaignId));
    } catch (err) {
      setError(err.message || 'Failed to delete campaign');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header with Create Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">Campaigns</h1>
            <p className="text-slate-400 text-lg">Manage and create testimonial campaigns</p>
          </div>
          <Link href="/dashboard/campaigns/create" className="mt-4 md:mt-0 cursor-pointer">
            <button className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/40 hover:scale-105 transition duration-300 cursor-pointer transform active:scale-95">
              + Create Campaign
            </button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && campaigns.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-slate-100 mb-2">No campaigns yet</h3>
            <p className="text-slate-400 mb-6">Create your first campaign to start collecting testimonials</p>
            <Link href="/dashboard/campaigns/create" className="cursor-pointer inline-block">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/40 transition duration-300 cursor-pointer">
                Create First Campaign
              </button>
            </Link>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 animate-spin">⚙️</div>
            <p className="text-slate-400">Loading campaigns...</p>
          </div>
        )}

        {/* Campaigns Grid */}
        {!loading && campaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-800/50 rounded-xl p-6 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 transition duration-300 flex flex-col overflow-hidden"
              >
                {/* Gradient Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

                {/* Campaign Title */}
                <h3 className="text-lg font-bold text-slate-100 mb-2">{campaign.name}</h3>

                {/* Status Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ● Active
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
                  <div className="bg-slate-800/40 hover:bg-slate-800/60 rounded-lg p-3 transition duration-300 border border-slate-800/30">
                    <p className="text-slate-400 text-xs mb-1 font-medium">Questions</p>
                    <p className="text-2xl font-bold text-slate-100">{campaign.questions?.length || 0}</p>
                  </div>
                  <div className="bg-slate-800/40 hover:bg-slate-800/60 rounded-lg p-3 transition duration-300 border border-slate-800/30">
                    <p className="text-slate-400 text-xs mb-1 font-medium">Testimonials</p>
                    <p className="text-2xl font-bold text-slate-100">{campaign.testimonialCount || 0}</p>
                  </div>
                </div>

                {/* Date */}
                <p className="text-slate-500 text-sm mb-6 font-medium">Created: {formatDate(campaign.createdAt)}</p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCopyLink(campaign._id)}
                    className="flex-1 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-blue-400 border border-blue-500/30 rounded-lg font-medium transition duration-300 cursor-pointer"
                  >
                    Copy Link
                  </button>
                  <Link href={`/record/${campaign._id}`} className="flex-1 cursor-pointer">
                    <button className="w-full px-4 py-2 bg-slate-800/40 hover:bg-slate-800/60 text-slate-100 rounded-lg font-medium transition duration-300 cursor-pointer border border-slate-800/30">
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteCampaign(campaign._id)}
                    className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-medium transition duration-300 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
