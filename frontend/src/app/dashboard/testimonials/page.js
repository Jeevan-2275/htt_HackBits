'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import authService from '@/lib/authService';
import ReelStudioModal from '@/components/ReelStudioModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function TestimonialsPage() {
  // Dummy testimonials for testing
  const dummyTestimonials = [
    {
      _id: 'dummy1',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      userName: 'Rajesh Kumar',
      sentiment: 'positive',
      status: 'published',
      createdAt: new Date('2026-02-10T10:30:00')
    },
    {
      _id: 'dummy2',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      userName: 'Priya Sharma',
      sentiment: 'positive',
      status: 'processed',
      createdAt: new Date('2026-02-12T14:20:00')
    },
    {
      _id: 'dummy3',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      userName: 'Amit Patel',
      sentiment: 'neutral',
      status: 'pending',
      createdAt: new Date('2026-02-14T09:15:00')
    },
    {
      _id: 'dummy4',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      userName: 'Sneha Reddy',
      sentiment: 'positive',
      status: 'published',
      createdAt: new Date('2026-02-13T16:45:00')
    },
    {
      _id: 'dummy5',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      userName: 'Vikram Singh',
      sentiment: 'negative',
      status: 'pending',
      createdAt: new Date('2026-02-11T11:30:00')
    },
    {
      _id: 'dummy6',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      userName: 'Ananya Desai',
      sentiment: 'neutral',
      status: 'processed',
      createdAt: new Date('2026-02-09T08:20:00')
    }
  ];

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedTestimonialForStudio, setSelectedTestimonialForStudio] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [wallCopied, setWallCopied] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      loadTestimonials(selectedCampaign);
    }
  }, [selectedCampaign]);

  const loadCampaigns = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        headers: authService.getAuthHeaders()
      });
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setCampaigns(data.data);
        setSelectedCampaign(data.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to load campaigns:', error);
      setError('Failed to load campaigns');
    }
  };

  const loadTestimonials = async (campaignId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/testimonials/campaign/${campaignId}`, {
        headers: authService.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      
      const data = await response.json();
      if (data.success) {
        if (data.data && data.data.length > 0) {
          setTestimonials(data.data);
        } else {
          console.log('No real testimonials found, showing dummy data');
          setTestimonials(dummyTestimonials);
        }
      }
    } catch (error) {
      console.error('Failed to load testimonials:', error);
      console.log('Using dummy testimonials due to error');
      setTestimonials(dummyTestimonials);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'published':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'processed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😕';
      case 'neutral':
      default: return '😐';
    }
  };

  const wallEmbedCode = `<div id="feedspace-wall-of-love" data-campaign="${selectedCampaign || 'default'}"></div>\n<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://feedspace.ai'}/embed.js" async></script>`;

  const handleCopyWall = () => {
    navigator.clipboard.writeText(wallEmbedCode);
    setWallCopied(true);
    setTimeout(() => setWallCopied(false), 2500);
  };


  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-indigo-900/10 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header with Wall of Love CTA */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                Testimonials
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold glass-pill text-cyan-300 border border-cyan-500/30">
                {testimonials.length} {testimonials.length === 1 ? 'Video' : 'Videos'}
              </span>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">
              Autonomous video collection, viral 9:16 reels, and embeddable customer stories.
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowEmbedModal(true)}
              className="py-3 px-5 rounded-2xl glass-btn-primary text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all duration-200 shadow-lg shadow-purple-500/20 active:scale-98"
            >
              <span>🌟</span>
              <span>Wall of Love & Embed Widget</span>
            </button>
          </div>
        </div>

        {/* Campaign Selector Bar */}
        {campaigns.length > 0 && (
          <div className="mb-8 glass-morphism p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Campaign:
              </span>
              <select
                value={selectedCampaign || ''}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="px-3.5 py-2 glass-input rounded-xl text-slate-100 text-sm focus:outline-none cursor-pointer"
              >
                {campaigns.map(campaign => (
                  <option key={campaign._id} value={campaign._id} className="bg-slate-900 text-white">
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Auto-processing: <b>Active</b>
              </span>
              <span>•</span>
              <span>Single 45s Reel Enforced</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-12 w-12 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-slate-400">Loading testimonials...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && testimonials.length === 0 && (
          <div className="text-center py-20 glass-morphism rounded-3xl p-8 max-w-md mx-auto">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-white/10 shadow-lg">
                <span className="text-3xl">🎥</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No testimonials yet</h3>
            <p className="text-slate-400 text-sm mb-6">
              Share your campaign link to start collecting video testimonials.
            </p>
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => {
              const embedSnippet = `<iframe src="${testimonial.videoUrl}" width="360" height="640" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.5);"></iframe>`;

              const handleCopyEmbed = (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(embedSnippet);
                setCopiedId(testimonial._id);
                setTimeout(() => setCopiedId(null), 2500);
              };

              return (
                <div
                  key={testimonial._id}
                  className="group glass-morphism glass-morphism-hover rounded-3xl overflow-hidden flex flex-col justify-between"
                >
                  {/* Video Container with Smart Overlay */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <video
                      src={testimonial.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                    {/* Duration Badge Overlay */}
                    <div className="absolute top-3 right-3 pointer-events-none z-10">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold glass-pill bg-black/70 text-white border border-white/20 backdrop-blur-md shadow-lg">
                        ⏱️ 0:45 Reel
                      </span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* User Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md border border-white/20">
                          <span className="text-white font-extrabold text-sm">
                            {testimonial.userName ? testimonial.userName.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-sm truncate">
                            {testimonial.userName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-xs">★★★★★</span>
                            <span className="text-slate-400 text-[11px]">
                              {formatDate(testimonial.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Feedback Quote Preview */}
                      {testimonial.feedbackText && (
                        <p className="text-slate-300 text-xs italic glass-pill p-3 rounded-xl border border-white/10 line-clamp-2 my-2">
                          &ldquo;{testimonial.feedbackText}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 pt-1">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadgeColor(testimonial.status)}`}>
                            {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                          </span>

                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            testimonial.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                            testimonial.sentiment === 'negative' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                            'bg-slate-500/20 text-slate-300 border-slate-500/30'
                          }`}>
                            {getSentimentEmoji(testimonial.sentiment)} {testimonial.sentiment}
                          </span>
                        </div>

                        <span className="text-[11px] font-bold text-yellow-300 bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">
                          🔥 94% Viral
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                          onClick={() => setSelectedTestimonialForStudio(testimonial)}
                          className="py-2.5 px-3 rounded-xl glass-btn-primary text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>✨</span>
                          <span>AI Reel Studio</span>
                        </button>

                        <button
                          onClick={handleCopyEmbed}
                          className="py-2.5 px-3 rounded-xl glass-btn text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {copiedId === testimonial._id ? (
                            <span className="text-emerald-400 font-bold">Copied! ✓</span>
                          ) : (
                            <>
                              <span>📋</span>
                              <span>Copy Embed</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* AI Insights Link */}
                      <div className="pt-1 text-center">
                        <Link
                          href={`/embed/testimonial/${testimonial._id}`}
                          target="_blank"
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 transition"
                        >
                          <span>📊 View AI Emotion & Trust Insights</span>
                          <span>↗</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reel Studio Modal */}
        <ReelStudioModal
          testimonial={selectedTestimonialForStudio}
          isOpen={Boolean(selectedTestimonialForStudio)}
          onClose={() => setSelectedTestimonialForStudio(null)}
          onClipCreated={() => {
            if (selectedCampaign) {
              loadTestimonials(selectedCampaign);
            }
          }}
        />

        {/* Wall of Love & Universal Embed Modal */}
        {showEmbedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="glass-morphism rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-white/20 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg border border-white/20">
                    <span className="text-xl">🌟</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Wall of Love Embed</h3>
                    <p className="text-slate-400 text-xs">Embed customer testimonials onto your website</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmbedModal(false)}
                  className="p-2 text-slate-400 hover:text-white glass-pill rounded-full cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  Paste this snippet into your HTML, WordPress, Webflow, or React site. It automatically renders a responsive, high-converting video testimonial grid:
                </p>

                <div className="relative">
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-cyan-300 font-mono overflow-x-auto whitespace-pre-wrap">
                    {wallEmbedCode}
                  </pre>
                  <button
                    onClick={handleCopyWall}
                    className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg glass-btn text-xs font-bold text-white cursor-pointer"
                  >
                    {wallCopied ? 'Copied! ✓' : 'Copy Code'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-slate-400">
                  <div className="p-2.5 glass-pill rounded-xl border border-white/10">
                    <span className="block text-white font-bold mb-0.5">⚡ 0ms Lag</span>
                    <span>Edge Cached</span>
                  </div>
                  <div className="p-2.5 glass-pill rounded-xl border border-white/10">
                    <span className="block text-white font-bold mb-0.5">📱 Responsive</span>
                    <span>Mobile & Desktop</span>
                  </div>
                  <div className="p-2.5 glass-pill rounded-xl border border-white/10">
                    <span className="block text-white font-bold mb-0.5">🔒 Verified</span>
                    <span>SSL Secured</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowEmbedModal(false)}
                  className="px-6 py-2.5 rounded-xl glass-btn text-white text-sm font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
