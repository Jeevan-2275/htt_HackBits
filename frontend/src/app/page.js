'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <section className="relative min-h-screen bg-slate-950 overflow-hidden py-20 md:py-32">
        {/* Background Gradient Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Turn Customer Stories Into{' '}
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Marketing Gold
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-xl">
                Collect, process and publish AI-powered video testimonials instantly. No editing skills required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup" className="cursor-pointer w-full">
                  <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105 cursor-pointer">
                    Get Started Free
                  </button>
                </Link>
                <button 
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full px-8 py-4 border-2 border-slate-700 text-slate-100 font-bold rounded-xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition duration-300 cursor-pointer">
                  Watch Demo
                </button>
              </div>
              <p className="text-sm text-slate-500 pt-4">
                ✓ Free to start • No credit card required • Takes 2 minutes
              </p>
            </div>

            {/* Right Glassmorphism Card */}
            <div className="relative h-96 lg:h-full lg:min-h-[500px]">
              {/* Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl blur-3xl opacity-50"></div>
              
              {/* Glassmorphism Card */}
              <div className="relative h-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
                
                {/* Mock Dashboard Content */}
                <div className="relative space-y-4">
                  <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-2/3"></div>
                  <div className="h-2 bg-slate-700/50 rounded-full w-1/2"></div>
                  <div className="space-y-2 pt-6">
                    <div className="h-2 bg-slate-700/50 rounded-full"></div>
                    <div className="h-2 bg-slate-700/50 rounded-full w-5/6"></div>
                    <div className="h-2 bg-slate-700/50 rounded-full w-4/5"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-8">
                    <div className="h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg border border-slate-700/50"></div>
                    <div className="h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg border border-slate-700/50"></div>
                    <div className="h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg border border-slate-700/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-20 md:py-28 bg-slate-950 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              The Old Way Is Slow & Manual
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Getting video testimonials shouldn't take months.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Problem Card 1 */}
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-2 transition duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Schedule Meetings</h3>
              <p className="text-slate-400">
                Coordinate calendars, reschedule last-minute, chase customers to record.
              </p>
            </div>

            {/* Problem Card 2 */}
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-2 transition duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Manually Edit Videos</h3>
              <p className="text-slate-400">
                Spend hours in editing software, trim, color correct, add captions.
              </p>
            </div>

            {/* Problem Card 3 */}
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-2 transition duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Extract Highlights Manually</h3>
              <p className="text-slate-400">
                Watch entire videos, pick best quotes, create multiple clip versions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative py-20 md:py-28 bg-slate-950 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              The AI-Powered Way
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Automated, scalable, and ready to publish in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Solution Card 1 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-slate-900/80 border border-slate-800/50 rounded-xl p-8 backdrop-blur-sm">
                <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">Share a Link</h3>
                <p className="text-slate-400">
                  Send one link to customers. They record from their browser, phone, or desktop.
                </p>
              </div>
            </div>

            {/* Solution Card 2 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-slate-900/80 border border-slate-800/50 rounded-xl p-8 backdrop-blur-sm">
                <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">AI Processes Automatically</h3>
                <p className="text-slate-400">
                  Our AI transcribes, analyzes sentiment, and identifies the best moments automatically.
                </p>
              </div>
            </div>

            {/* Solution Card 3 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-slate-900/80 border border-slate-800/50 rounded-xl p-8 backdrop-blur-sm">
                <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">Get Reel-Ready Clips</h3>
                <p className="text-slate-400">
                  Download styled clips optimized for Instagram, TikTok, LinkedIn, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 md:py-28 bg-slate-950 overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to collect and publish testimonials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900/50 border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">Link-Based Guided Recording</h3>
              <p className="text-slate-400 mb-4">
                Customers get guided prompts to record authentic testimonials. No script required.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Works on mobile and desktop</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Auto-retry if quality is poor</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">Automatic Transcription</h3>
              <p className="text-slate-400 mb-4">
                Every video is automatically transcribed with industry-leading accuracy.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>99% accuracy with AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Export as SRT or VTT</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/50 border border-pink-500/20 rounded-xl p-8 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 transition duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">AI Highlight Extraction</h3>
              <p className="text-slate-400 mb-4">
                Our AI identifies the most compelling moments and powerful quotes.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">✓</span>
                  <span>Sentiment analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">✓</span>
                  <span>Emotional impact detection</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/50 border border-amber-500/20 rounded-xl p-8 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">Reel-Ready Clip Generation</h3>
              <p className="text-slate-400 mb-4">
                Automatically generate perfectly formatted clips for all social platforms.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>Multiple format templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>Auto captions & branding</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 md:py-28 bg-slate-950 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Four simple steps from campaign creation to published clips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

            {/* Step 1 */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg relative z-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-100 text-center mb-3">
                Create Campaign
              </h3>
              <p className="text-slate-400 text-center text-sm">
                Set up your testimonial collection campaign with custom prompts.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg relative z-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-100 text-center mb-3">
                Share Link
              </h3>
              <p className="text-slate-400 text-center text-sm">
                Share with customers via email, SMS, or social media.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg relative z-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-100 text-center mb-3">
                AI Processes
              </h3>
              <p className="text-slate-400 text-center text-sm">
                AI transcribes, analyzes, and extracts highlights automatically.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg relative z-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                4
              </div>
              <h3 className="text-xl font-bold text-slate-100 text-center mb-3">
                Download Clips
              </h3>
              <p className="text-slate-400 text-center text-sm">
                Get ready-to-publish clips in all formats instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Start Collecting Powerful Testimonials Today
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of companies turning customer stories into their most powerful marketing asset.
          </p>
          <Link href="/signup" className="cursor-pointer inline-block">
            <button className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 text-lg transform cursor-pointer">
              Create Free Campaign
            </button>
          </Link>
          <p className="text-blue-100 text-sm mt-6">
            No credit card needed • Start free • Upgrade anytime
          </p>
        </div>
      </section>
    </>
  );
}
