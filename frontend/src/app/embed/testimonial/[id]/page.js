'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function TestimonialEmbedPage() {
  const params = useParams();
  const testimonialId = params?.id;
  
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInsights = async () => {
      try {
        if (!testimonialId) return;
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/testimonials/${testimonialId}/insights`);
        
        if (!response.ok) {
          throw new Error('Failed to load insights');
        }
        
        const data = await response.json();
        setInsights(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadInsights();
  }, [testimonialId]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading testimonial insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-slate-400">No insights available</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 md:p-8">
      {/* Container - embeddable widget */}
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Customer Insights
          </h1>
          <p className="text-slate-400 mt-2">AI-Powered Testimonial Analysis</p>
        </div>

        {/* Customer Info */}
        {insights.customerName && (
          <div className="mb-8 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-slate-400 text-sm">Customer</p>
            <p className="text-2xl font-bold text-white mt-1">{insights.customerName}</p>
          </div>
        )}

        {/* AI Summary */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-blue-500/30 backdrop-blur">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">✨</span>
            <h2 className="text-xl font-bold text-white">Summary</h2>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed">
            {insights.insights?.summary || 'Loading summary...'}
          </p>
        </div>

        {/* Emotion Tags */}
        {insights.insights?.emotions && insights.insights.emotions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">❤️</span>
              <h2 className="text-xl font-bold text-white">Emotions Detected</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {insights.insights.emotions.map((emotion, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 text-purple-300 font-medium"
                >
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Trust Score */}
        {insights.insights?.trustScore !== undefined && (
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-green-500/30 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <h2 className="text-xl font-bold text-white">Trust Score</h2>
              </div>
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                {insights.insights.trustScore}%
              </span>
            </div>
            
            {/* Score Bar */}
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${insights.insights.trustScore}%` }}
              />
            </div>

            {/* Score Breakdown */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="p-2 rounded bg-slate-700/50">
                <p className="text-slate-400">Specificity</p>
                <p className="text-green-400 font-bold">30%</p>
              </div>
              <div className="p-2 rounded bg-slate-700/50">
                <p className="text-slate-400">Confidence</p>
                <p className="text-green-400 font-bold">30%</p>
              </div>
              <div className="p-2 rounded bg-slate-700/50">
                <p className="text-slate-400">Results</p>
                <p className="text-green-400 font-bold">25%</p>
              </div>
              <div className="p-2 rounded bg-slate-700/50">
                <p className="text-slate-400">Authenticity</p>
                <p className="text-green-400 font-bold">15%</p>
              </div>
            </div>
          </div>
        )}

        {/* Key Points */}
        {insights.insights?.keyPoints && insights.insights.keyPoints.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⭐</span>
              <h2 className="text-xl font-bold text-white">Key Points</h2>
            </div>
            <div className="space-y-3">
              {insights.insights.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-800/50 border border-yellow-500/20 flex items-start gap-3"
                >
                  <span className="text-yellow-400 font-bold mt-1">→</span>
                  <span className="text-slate-300">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Original Transcript (optional) */}
        {insights.transcript && (
          <div className="mb-8 p-6 rounded-xl bg-slate-800/30 border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-3">Full Transcript</h2>
            <p className="text-slate-400 text-sm leading-relaxed italic">
              "{insights.transcript}"
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-700 text-center">
          <p className="text-slate-500 text-sm">
            🤖 AI Testimonial Intelligence • Powered by GROQ AI
          </p>
        </div>
      </div>
    </div>
  );
}
