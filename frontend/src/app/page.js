'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // Social proof testimonials data
  const socialProofTestimonials = [
    {
      name: 'Sarah Chen',
      role: 'Marketing Director',
      avatar: '👩‍💼',
      quote: '"Feedspace transformed how we collect customer stories. 10x faster than before!"',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Founder, TechStart',
      avatar: '👨‍💻',
      quote: '"The AI processing is incredible. Our testimonials look professional in minutes."',
    },
    {
      name: 'Emily Watson',
      role: 'Head of Growth',
      avatar: '👩‍🎤',
      quote: '"We\'ve doubled our conversion rate using Feedspace testimonial clips."',
    },
  ];

  return (
    <>
      {/* Hero Section with Animated Aurora Background */}
      <section className="relative min-h-screen bg-[#050816] overflow-hidden py-24 md:py-36">
        {/* New Aurora Gradient Mesh Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Blue Gradient Blob - Top Left */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-[130px] opacity-30 animate-aurora-pulse"></div>
          
          {/* Purple Gradient Blob - Top Right */}
          <div className="absolute -top-20 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[130px] opacity-25 animate-aurora-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Pink Gradient Blob - Bottom Left */}
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-screen filter blur-[130px] opacity-20 animate-aurora-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Central Aurora Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-r from-blue-600/20 via-purple-500/20 to-pink-500/20 rounded-full filter blur-[150px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content with Floating Animation */}
            <div className="space-y-8 animate-float">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
                Turn Customer Stories Into{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Marketing Gold
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-xl">
                Collect, process and publish AI-powered video testimonials instantly. Transform customer voices into your most powerful marketing asset.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup" className="cursor-pointer w-full">
                  <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/60 transition duration-300 transform hover:scale-105 cursor-pointer">
                    Get Started Free
                  </button>
                </Link>
                <button 
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full px-8 py-4 glass text-white font-bold rounded-xl hover:bg-white/10 transition duration-300 cursor-pointer">
                  Watch Demo
                </button>
              </div>
              <p className="text-sm text-white/50 pt-4">
                ✓ Free to start • No credit card required • Takes 2 minutes
              </p>
            </div>

            {/* Right Glassmorphism Card */}
            <div className="relative h-96 lg:h-full lg:min-h-[500px]">
              {/* Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-pink-500/30 rounded-3xl blur-3xl opacity-60"></div>
              
              {/* Premium Glass Card */}
              <div className="relative h-full glass shadow-2xl shadow-purple-500/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-pink-500/10"></div>
                
                {/* Mock Dashboard Content */}
                <div className="relative space-y-4 p-8">
                  <div className="h-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full w-2/3 shadow-lg shadow-purple-500/30"></div>
                  <div className="h-2 bg-white/20 rounded-full w-1/2"></div>
                  <div className="space-y-2 pt-6">
                    <div className="h-2 bg-white/20 rounded-full"></div>
                    <div className="h-2 bg-white/20 rounded-full w-5/6"></div>
                    <div className="h-2 bg-white/20 rounded-full w-4/5"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-8">
                    <div className="h-16 bg-gradient-to-br from-blue-400/20 to-pink-500/20 rounded-lg border border-white/10 backdrop-blur-sm"></div>
                    <div className="h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-lg border border-white/10 backdrop-blur-sm"></div>
                    <div className="h-16 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-lg border border-white/10 backdrop-blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-20 md:py-28 bg-[#050816] overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-[130px] opacity-10 animate-aurora-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The Old Way Is Slow & Manual
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Getting video testimonials shouldn't take months.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Problem Card 1 */}
            <div className="glass glass-hover">
              <div className="w-12 h-12 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Schedule Meetings</h3>
              <p className="text-white/60">
                Coordinate calendars, reschedule last-minute, chase customers to record.
              </p>
            </div>

            {/* Problem Card 2 */}
            <div className="glass glass-hover">
              <div className="w-12 h-12 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Manually Edit Videos</h3>
              <p className="text-white/60">
                Spend hours in editing software, trim, color correct, add captions.
              </p>
            </div>

            {/* Problem Card 3 */}
            <div className="glass glass-hover">
              <div className="w-12 h-12 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Extract Highlights Manually</h3>
              <p className="text-white/60">
                Watch entire videos, pick best quotes, create multiple clip versions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative py-20 md:py-28 bg-[#050816] overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[130px] opacity-15 animate-aurora-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The AI-Powered Way
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Automated, scalable, and ready to publish in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Solution Card 1 */}
            <div className="glass glass-hover group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur -z-10"></div>
              <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Share a Link</h3>
              <p className="text-white/60">
                Send one link to customers. They record from their browser, phone, or desktop.
              </p>
            </div>

            {/* Solution Card 2 */}
            <div className="glass glass-hover group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur -z-10"></div>
              <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Processes Automatically</h3>
              <p className="text-white/60">
                Our AI transcribes, analyzes sentiment, and identifies the best moments automatically.
              </p>
            </div>

            {/* Solution Card 3 */}
            <div className="glass glass-hover group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur -z-10"></div>
              <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Get Reel-Ready Clips</h3>
              <p className="text-white/60">
                Download styled clips optimized for Instagram, TikTok, LinkedIn, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 md:py-28 bg-[#050816] overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[130px] opacity-10 animate-aurora-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Everything you need to collect and publish testimonials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="glass glass-hover border-blue-400/20 hover:border-blue-400/50">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Link-Based Guided Recording</h3>
              <p className="text-white/60 mb-4">
                Customers get guided prompts to record authentic testimonials. No script required.
              </p>
              <ul className="space-y-2 text-white/60">
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
            <div className="glass glass-hover border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-500/10">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-purple-500/40">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Automatic Transcription</h3>
              <p className="text-white/60 mb-4">
                Every video is automatically transcribed with industry-leading accuracy.
              </p>
              <ul className="space-y-2 text-white/60">
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
            <div className="glass glass-hover border-pink-500/20 hover:border-pink-500/50 hover:shadow-pink-500/10">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-pink-500/40">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Highlight Extraction</h3>
              <p className="text-white/60 mb-4">
                Our AI identifies the most compelling moments and powerful quotes.
              </p>
              <ul className="space-y-2 text-white/60">
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
            <div className="glass glass-hover border-blue-400/20 hover:border-blue-400/50 hover:shadow-blue-400/10">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-blue-500/40">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Reel-Ready Clip Generation</h3>
              <p className="text-white/60 mb-4">
                Automatically generate perfectly formatted clips for all social platforms.
              </p>
              <ul className="space-y-2 text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Multiple format templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Auto captions & branding</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials Section */}
      <section className="relative py-20 md:py-28 bg-[#050816] overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-blue-600/15 via-purple-500/15 to-pink-600/15 rounded-full filter blur-[100px] animate-aurora-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass text-sm text-white/70 mb-6">
              <span className="flex gap-1">
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
              </span>
              <span>Loved by 500+ companies</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Customers</span> Say
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Join thousands of marketers using Feedspace to grow their business.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {socialProofTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="group relative bg-white/5/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg shadow-purple-500/10 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
              >
                {/* Quote Icon */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Play Button */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-blue-400/20 to-pink-500/20 border border-slate-700/50 rounded-full flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300 cursor-pointer">
                  <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                
                {/* Content */}
                <div className="pt-4">
                  <p className="text-white/80 text-lg leading-relaxed mb-6 italic">{testimonial.quote}</p>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10/50">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400/30 to-pink-500/30 rounded-full flex items-center justify-center text-2xl border border-slate-700/50 shadow-lg shadow-purple-500/10">
                      {testimonial.avatar}
                    </div>
                    
                    <div>
                      <h4 className="text-white font-bold">{testimonial.name}</h4>
                      <p className="text-white/50 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/5/40 backdrop-blur-md border border-white/10/50 rounded-xl">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">500+</p>
              <p className="text-white/60 text-sm">Companies</p>
            </div>
            <div className="text-center p-6 bg-white/5/40 backdrop-blur-md border border-white/10/50 rounded-xl">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">10K+</p>
              <p className="text-white/60 text-sm">Testimonials</p>
            </div>
            <div className="text-center p-6 bg-white/5/40 backdrop-blur-md border border-white/10/50 rounded-xl">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">98%</p>
              <p className="text-white/60 text-sm">Satisfaction</p>
            </div>
            <div className="text-center p-6 bg-white/5/40 backdrop-blur-md border border-white/10/50 rounded-xl">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">2x</p>
              <p className="text-white/60 text-sm">Conversion Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 md:py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              🚀 How It Works
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Four simple steps from campaign creation to published clips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg shadow-purple-500/30 relative z-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white hover:scale-110 transition">
                  1
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-3">
                  Create Campaign
                </h3>
                <p className="text-white/60 text-center text-sm leading-relaxed">
                  Set up your testimonial collection campaign with custom prompts.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg shadow-purple-500/30 relative z-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white hover:scale-110 transition">
                  2
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-3">
                  Share Link
                </h3>
                <p className="text-white/60 text-center text-sm leading-relaxed">
                  Share with customers via email, SMS, or social media.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg shadow-purple-500/30 relative z-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white hover:scale-110 transition">
                  3
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-3">
                  AI Processes
                </h3>
                <p className="text-white/60 text-center text-sm leading-relaxed">
                  AI transcribes, analyzes, and extracts highlights automatically.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg shadow-purple-500/30 relative z-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white hover:scale-110 transition">
                  4
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-3">
                  Download Clips
                </h3>
                <p className="text-white/60 text-center text-sm leading-relaxed">
                  Get ready-to-publish clips in all formats instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 md:py-40 bg-gradient-to-r from-[#0B1020] via-indigo-950 to-[#0B1020] overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Start Collecting Powerful{' '}
              <span className="bg-gradient-to-r from-yellow-300 via-blue-200 to-purple-200 bg-clip-text text-transparent">Testimonials Today</span>
            </h2>
            <p className="text-lg md:text-xl text-cyan-100 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of companies turning customer stories into their most powerful marketing asset. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup" className="cursor-pointer">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-white to-blue-200 rounded-xl opacity-50 group-hover:opacity-100 transition duration-300 blur"></div>
                  <button className="relative px-10 py-4 bg-white hover:bg-blue-50 text-blue-900 font-bold rounded-xl transition duration-300 text-lg cursor-pointer hover:shadow-2xl hover:scale-105">
                    ✨ Create Free Campaign
                  </button>
                </div>
              </Link>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 hover:shadow-2xl transition duration-300 text-lg cursor-pointer hover:scale-105">
                📹 Watch Demo
              </button>
            </div>
            <p className="text-cyan-100 text-sm">
              ✓ Free forever tier • Take 2 minutes • Upgrade anytime
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
