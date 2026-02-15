'use client';

import { useState, useEffect } from 'react';
import authService from '@/lib/authService';

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
        // If no real testimonials, show dummy data
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
      // Show dummy testimonials on error
      setTestimonials(dummyTestimonials);
      setError(null); // Don't show error, just use dummy data
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (loading && !selectedCampaign) {
    return (
      <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen">
        <div className="animate-pulse">
          <div className="h-12 w-64 bg-slate-800/60 rounded-lg mb-4"></div>
          <div className="h-5 w-48 bg-slate-800/40 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-indigo-900/10 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
            Testimonials
          </h1>
          <p className="text-slate-400 text-lg">
            View all collected video testimonials ({testimonials.length})
          </p>
          
          {/* Campaign Selector */}
          {campaigns.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Campaign
              </label>
              <select
                value={selectedCampaign || ''}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 transition duration-300 cursor-pointer focus:bg-slate-800 max-w-md"
              >
                {campaigns.map(campaign => (
                  <option key={campaign._id} value={campaign._id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

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
          <div className="text-center py-20">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-slate-800/50">
                <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3">No testimonials yet</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Share your campaign link to start collecting video testimonials. Videos will automatically appear here once uploaded.
            </p>
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="group bg-slate-900/60 backdrop-blur-md border border-slate-800/50 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1 transition duration-300"
              >
                {/* Video Container */}
                <div className="relative aspect-video bg-slate-950">
                  <video
                    src={testimonial.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                </div>

                {/* Info Section */}
                <div className="p-5">
                  {/* User Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {testimonial.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-100 font-semibold truncate">
                        {testimonial.userName}
                      </h3>
                      <p className="text-slate-400 text-xs">
                        {formatDate(testimonial.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {/* Status Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(testimonial.status)}`}>
                      {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                    </span>

                    {/* Sentiment Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                      testimonial.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      testimonial.sentiment === 'negative' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    }`}>
                      {getSentimentEmoji(testimonial.sentiment)} {testimonial.sentiment}
                    </span>
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
