'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // Interactive Demo Aspect Ratio Switcher state
  const [demoRatio, setDemoRatio] = useState('9:16'); // '9:16' | '1:1' | '16:9'
  const [demoPlatform, setDemoPlatform] = useState('instagram'); // 'instagram' | 'linkedin' | 'tiktok'
  const [activeFaq, setActiveFaq] = useState(null);

  // Social proof brand logos
  const brandLogos = [
    { name: 'Linear', symbol: '⌘' },
    { name: 'Vercel', symbol: '▲' },
    { name: 'Supabase', symbol: '⚡' },
    { name: 'Stripe', symbol: '💳' },
    { name: 'Notion', symbol: '📑' },
    { name: 'Loom', symbol: '🎥' }
  ];

  // Testimonials data
  const socialProofTestimonials = [
    {
      name: 'Sarah Chen',
      role: 'VP of Marketing @ ScaleFlow',
      avatar: '👩‍💼',
      metrics: '+310% Video Submissions',
      quote: 'Feedspace transformed how we collect customer stories. Customers actually respond because the AI interview is frictionless!',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Founder @ CloudStack',
      avatar: '👨‍💻',
      metrics: '45s Viral Reels Ready',
      quote: 'The AI Reel Director is mindblowing. We went from spending $2,000/month on freelance video editors to auto-generating 9:16 clips in 10 seconds.',
    },
    {
      name: 'Emily Watson',
      role: 'Head of Growth @ SaaSify',
      avatar: '👩‍🎤',
      metrics: '2.4x Conversion Lift',
      quote: 'Embedding Feedspace vertical reels on our landing page doubled demo bookings. Authentic customer video is our highest ROI channel.',
    },
  ];

  // FAQ items matching SEO Schema.org
  const faqList = [
    {
      q: 'How does Feedspace AI generate video testimonials?',
      a: 'Feedspace provides a single shareable link. When customers click it, an autonomous AI interviewer asks conversational questions, transcribes the speech with 99% accuracy, analyzes sentiment, and auto-edits a 30s to 60s viral vertical reel with dynamic karaoke subtitles.'
    },
    {
      q: 'Can I export clips for TikTok, Instagram Reels, and LinkedIn?',
      a: 'Yes! Feedspace auto-frames your video into 9:16 vertical (Reels & TikTok), 1:1 square (LinkedIn & Instagram feed), or 16:9 widescreen (YouTube & Web Embeds) with one click, complete with platform-tailored copy and hashtags.'
    },
    {
      q: 'Do customers need to download an app or sign up to record?',
      a: 'No app or account required! Customers can record directly from Chrome, Safari, iOS, or Android with zero friction. The browser recording works instantly on mobile and desktop.'
    },
    {
      q: 'How long does it take to process a video testimonial?',
      a: 'Most customer testimonials are transcribed, analyzed for viral hooks, and rendered with custom captions in under 15 seconds.'
    },
    {
      q: 'Can I embed the testimonial video player on my website?',
      a: 'Absolutely. Feedspace gives you a lightweight, responsive embed iframe snippet that you can paste into WordPress, Webflow, Framer, Next.js, or HTML in seconds.'
    }
  ];

  return (
    <main className="relative bg-[#050816] text-white selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* ========================================================================= */}
      {/* HERO SECTION WITH INTERACTIVE LIVE REEL PREVIEW */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden py-16 md:py-24 border-b border-white/5">
        {/* Animated Aurora Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/15 rounded-full filter blur-[140px] animate-aurora-pulse"></div>
          <div className="absolute top-10 right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full filter blur-[160px] animate-aurora-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-[-10%] left-1/3 w-[500px] h-[500px] bg-pink-500/15 rounded-full filter blur-[150px] animate-aurora-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full neon-pill backdrop-blur-xl text-xs font-semibold text-purple-200">
                <span className="flex text-yellow-400">★★★★★</span>
                <span className="text-slate-300 font-medium">Rated 4.9/5 by 1,200+ Growth Teams</span>
                <span className="hidden sm:inline-block text-purple-400 font-bold">•</span>
                <span className="hidden sm:inline-block text-cyan-300 font-medium">Enterprise 2.0 AI</span>
              </div>

              {/* H1 Primary Heading */}
              <h1 className="font-heading text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08]">
                Turn Customer Stories Into{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Viral Video Reels
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Collect authentic customer video testimonials with an autonomous AI interviewer. Automatically extract 30s–60s high-converting clips with dynamic karaoke captions.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link href="/signup" id="hero-cta-btn" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-600/30 hover:shadow-2xl hover:shadow-purple-600/50 hover:scale-[1.03] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-3 cursor-pointer">
                    <span className="text-base tracking-wide">Start Free Campaign</span>
                    <span className="text-xl">✨</span>
                  </button>
                </Link>
                <button
                  id="hero-demo-btn"
                  onClick={() => document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto px-8 py-4 glass-card glass-card-hover text-white font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>Explore AI Studio Demo</span>
                </button>
              </div>

              {/* Feature Checkmarks */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-400 font-medium pt-2">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span> No credit card required
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span> Instant 9:16 vertical export
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span> 30s–60s viral highlights
                </span>
              </div>
            </div>

            {/* Right Interactive Reel Mockup Column */}
            <div className="lg:col-span-5 flex justify-center relative">
              
              {/* Outer Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-[40px] filter blur-3xl opacity-70 animate-glow-pulse pointer-events-none"></div>

              {/* Smartphone Frame Simulation with Frosted Glass Bezel */}
              <div className="relative w-[310px] sm:w-[340px] rounded-[42px] p-3.5 glass-morphism border border-white/25 shadow-2xl shadow-purple-950/60 transition duration-500 hover:scale-[1.01] hover:border-white/40">
                
                {/* Smartphone Speaker & Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950/90 rounded-full flex items-center justify-center gap-2 z-40 border border-white/10 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                  <div className="w-8 h-1 rounded-full bg-slate-800"></div>
                </div>

                {/* Video Reel Screen Container (9:16 Aspect Ratio) */}
                <div className="relative w-full aspect-[9/16] rounded-[32px] overflow-hidden bg-slate-950 border border-white/15 flex flex-col justify-between p-4 shadow-inner">
                  
                  {/* Frosted Diagonal Glare Sheen */}
                  <div className="absolute -top-10 -right-20 w-48 h-[140%] bg-gradient-to-r from-transparent via-white/8 to-transparent -rotate-12 pointer-events-none z-30"></div>
                  
                  {/* Top Floating Badges */}
                  <div className="pt-6 flex items-center justify-between z-20">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-pink-500/30 text-pink-300 border border-pink-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping"></span>
                      🔥 94% Viral Potential
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                      ⏱️ 0:45 Reel
                    </span>
                  </div>

                  {/* Viral Hook Banner Overlay */}
                  <div className="my-auto z-20 text-center space-y-2 px-1">
                    <div className="inline-block px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-slate-950 font-black text-xs tracking-wide shadow-xl uppercase">
                      🔥 THIS CHANGED OUR ENTIRE WORKFLOW
                    </div>

                    {/* Simulated Dynamic Subtitle Highlight */}
                    <div className="p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                      <p className="text-xs text-slate-200 font-bold leading-relaxed">
                        &ldquo;Setting it up took 5 minutes, and our response rates{' '}
                        <span className="bg-yellow-400 text-slate-950 px-1 py-0.5 rounded font-black">
                          jumped 300%
                        </span>
                        !&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Bottom Controls & Social Proof */}
                  <div className="space-y-3 z-20">
                    {/* Animated Audio Waveform */}
                    <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/5">
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
                        <span className="w-1 h-5 bg-purple-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></span>
                        <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce delay-300"></span>
                      </div>
                      <span className="text-[10px] text-slate-300 font-semibold">AI Voice Enhancer: ACTIVE</span>
                    </div>

                    {/* Verified Customer Card */}
                    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center font-bold text-xs text-white">
                        K
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold text-white truncate">Kiran Sharma</p>
                          <span className="text-cyan-400 text-[10px]">✓</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Verified Testimonial</p>
                      </div>
                    </div>
                  </div>

                  {/* Subtle Background Radial Shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BRAND LOGOS SOCIAL PROOF STRIP */}
      {/* ========================================================================= */}
      <section className="py-10 border-b border-white/5 bg-slate-950/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            Powering video testimonials & social proof for innovative product teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-70">
            {brandLogos.map((brand, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300 font-bold text-base tracking-wider hover:text-white transition duration-200">
                <span className="text-purple-400 text-lg">{brand.symbol}</span>
                <span>{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE DEMO STUDIO SECTION (#interactive-demo) */}
      {/* ========================================================================= */}
      <section id="interactive-demo" className="py-20 md:py-28 relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Interactive Reel Engine
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
              One Testimonial, Every Format in Seconds
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Test how Feedspace automatically reshapes and styles your customer testimonials for vertical shorts, feed posts, or website embeds.
            </p>
          </div>

          {/* Interactive Controller & Preview Box */}
          <div className="glass-card rounded-3xl p-6 md:p-10 max-w-4xl mx-auto border border-white/10 shadow-2xl">
            
            {/* Format Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <button
                id="demo-ratio-916"
                onClick={() => setDemoRatio('9:16')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition duration-200 cursor-pointer flex items-center gap-2 ${
                  demoRatio === '9:16'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>📱 9:16 Vertical Reel (TikTok / IG)</span>
              </button>
              <button
                id="demo-ratio-11"
                onClick={() => setDemoRatio('1:1')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition duration-200 cursor-pointer flex items-center gap-2 ${
                  demoRatio === '1:1'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>⏹️ 1:1 Square (LinkedIn / Feed)</span>
              </button>
              <button
                id="demo-ratio-169"
                onClick={() => setDemoRatio('16:9')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition duration-200 cursor-pointer flex items-center gap-2 ${
                  demoRatio === '16:9'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🖥️ 16:9 Landscape (Web Embed)</span>
              </button>
            </div>

            {/* Simulated Live Viewport based on selected ratio */}
            <div className="flex flex-col items-center justify-center min-h-[360px] bg-slate-950/80 rounded-2xl border border-slate-800 p-6 relative overflow-hidden">
              
              <div
                className={`relative transition-all duration-300 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 p-4 flex flex-col justify-between shadow-2xl ${
                  demoRatio === '9:16'
                    ? 'w-[240px] h-[400px]'
                    : demoRatio === '1:1'
                    ? 'w-[300px] h-[300px]'
                    : 'w-[90%] max-w-[480px] aspect-video'
                }`}
              >
                {/* Dynamic Aspect Ratio Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                    Aspect Ratio: {demoRatio}
                  </span>
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                    45.0s Auto-Trim
                  </span>
                </div>

                {/* Subtitle Box simulation */}
                <div className="text-center space-y-1.5 my-auto">
                  <span className="text-xs font-extrabold text-yellow-300 bg-yellow-400/20 px-2 py-1 rounded border border-yellow-400/30 inline-block uppercase">
                    🚀 &ldquo;OUR BEST MARKETING ASSET&rdquo;
                  </span>
                  <p className="text-xs text-white font-medium">
                    &ldquo;Conversion rate climbed 34% within the first week of deploying Feedspace reels.&rdquo;
                  </p>
                </div>

                {/* Video controls bottom simulation */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
                  <span>⏱️ 0:18 / 0:45</span>
                  <span className="text-emerald-400 font-bold">● High Quality 1080p</span>
                </div>
              </div>

              {/* Format specs */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
                <span>Codecs: <strong>H.264 / AAC 44.1kHz</strong></span>
                <span>•</span>
                <span>Framing: <strong>Smart Center Auto-Padding</strong></span>
                <span>•</span>
                <span>Subtitles: <strong>Karaoke Dynamic Sync</strong></span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BEFORE VS AFTER COMPARISON SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Transformative Workflow
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
              Stop Wasting 3 Weeks on a Single Video Review
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Compare the tedious legacy testimonial process with Feedspace autonomous AI studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* The Old Manual Way */}
            <div className="glass-card rounded-3xl p-8 border border-red-500/20 bg-gradient-to-b from-red-950/10 to-slate-950/80 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-lg">
                  ✕
                </div>
                <h3 className="text-xl font-bold text-red-200">The Old Way (Slow & Clunky)</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Scheduling awkward Zoom calls across timezones that often get cancelled.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Customers freeze when asked to read stiff, unnatural scripts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Hiring expensive video editors to cut horizontal videos into 9:16 reels.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Takes 3 to 4 weeks to publish a single usable customer story.</span>
                </li>
              </ul>
            </div>

            {/* The Feedspace AI Way */}
            <div className="glass-card rounded-3xl p-8 border border-emerald-500/30 bg-gradient-to-b from-emerald-950/15 to-slate-950/80 relative shadow-xl shadow-emerald-500/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-emerald-200">The Feedspace AI Way (Instant)</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Send a 1-click link. Customers record on phone or desktop in 2 minutes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Autonomous AI interviewer guides them naturally through authentic questions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Instant 30s–60s vertical reel rendering with animated karaoke subtitles.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Ready to publish on TikTok, Instagram, and your website in seconds!</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURES GRID SECTION (#features) */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 md:py-28 relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Platform Capabilities
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
              Engineered for Virality & Trust
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Everything high-growth startups and enterprises need to collect, produce, and scale video social proof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <article className="glass-card glass-card-hover rounded-3xl p-8 space-y-4 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20">
                🎙️
              </div>
              <h3 className="text-xl font-bold text-white">Autonomous AI Interviewer</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Adaptive AI prompts guide your customers through a friendly 3-question conversation, ensuring natural vocal energy and high video completion rates.
              </p>
            </article>

            {/* Feature 2 */}
            <article className="glass-card glass-card-hover rounded-3xl p-8 space-y-4 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20">
                ✂️
              </div>
              <h3 className="text-xl font-bold text-white">30s–60s Viral Highlight Cutter</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our RAG-powered Director extracts the single punchiest 30s to 60s highlight clip, filtering out filler words and pauses automatically.
              </p>
            </article>

            {/* Feature 3 */}
            <article className="glass-card glass-card-hover rounded-3xl p-8 space-y-4 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-2xl shadow-lg shadow-pink-500/20">
                💬
              </div>
              <h3 className="text-xl font-bold text-white">Dynamic Karaoke Subtitles</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Word-by-word animated caption overlays (MrBeast & TikTok style) keep viewers hooked, boosting 3-second hook retention by 42%.
              </p>
            </article>

            {/* Feature 4 */}
            <article className="glass-card glass-card-hover rounded-3xl p-8 space-y-4 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-2xl shadow-lg shadow-yellow-500/20">
                📊
              </div>
              <h3 className="text-xl font-bold text-white">Virality Scoring & Analytics</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Instant 0-100 Virality Score evaluates hook strength, clarity, and metric impact so you know exactly which testimonials will perform best.
              </p>
            </article>

            {/* Feature 5 */}
            <article className="glass-card glass-card-hover rounded-3xl p-8 space-y-4 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
                📱
              </div>
              <h3 className="text-xl font-bold text-white">Smart 9:16 Auto-Framing</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Universal aspect ratio conversion scales and auto-pads landscape or mobile footage into crisp vertical reels without crashing or distortion.
              </p>
            </article>

            {/* Feature 6 */}
            <article className="glass-card glass-card-hover rounded-3xl p-8 space-y-4 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
                🚀
              </div>
              <h3 className="text-xl font-bold text-white">Multi-Platform Social Copy</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Generates ready-to-publish captions, value bullet points, and trending hashtags for Instagram, LinkedIn, TikTok, and Twitter automatically.
              </p>
            </article>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOW IT WORKS SECTION (#how-it-works) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden border-b border-white/5 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Step-by-Step Flow
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
              From Customer Feedback to Marketing Asset in 4 Steps
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Feedspace automates the entire video production pipeline from initial prompt to final reel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="glass-card rounded-2xl p-6 text-center space-y-3 relative group">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition duration-300">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Create Campaign</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Set company goals, prompt questions, and voice persona in 60 seconds.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 text-center space-y-3 relative group">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition duration-300">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Share 1-Click Link</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Send via email, SMS, or in-app modal. No login or download required for users.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 text-center space-y-3 relative group">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-pink-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition duration-300">
                3
              </div>
              <h3 className="text-lg font-bold text-white">AI Director Processes</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transcribes audio, extracts viral hooks, and auto-frames to 9:16 vertical video.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 text-center space-y-3 relative group">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition duration-300">
                4
              </div>
              <h3 className="text-lg font-bold text-white">Publish Everywhere</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Export 30s–60s vertical reels or embed responsive video players on your site.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SOCIAL PROOF TESTIMONIALS SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Customer Success
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
              Loved by Fast-Moving Startups & Scaleups
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Here is what founders and marketing leaders say about scaling social proof with Feedspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialProofTestimonials.map((item, idx) => (
              <div key={idx} className="glass-card rounded-3xl p-8 flex flex-col justify-between border border-white/10 hover:border-purple-500/40 transition duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.avatar}</span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.metrics}
                    </span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/10">
                  <h4 className="text-white font-bold text-sm">{item.name}</h4>
                  <p className="text-slate-400 text-xs">{item.role}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FAQ SECTION WITH ACCORDION (#faq) */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 md:py-28 relative overflow-hidden border-b border-white/5 bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Frequently Asked Questions
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
              Everything You Need to Know
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Have questions about how Feedspace works? We have got you covered.
            </p>
          </div>

          <div className="space-y-4">
            {faqList.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div
                  key={i}
                  className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-cyan-300 transition cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span className={`text-xl font-mono text-purple-400 transform transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL CTA SECTION */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-slate-950 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-pink-500/20 text-pink-300 border border-pink-500/30">
            ⚡ Ready to Scale Social Proof?
          </span>

          <h2 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Start Collecting High-Converting Testimonials Today
          </h2>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Create your first AI campaign in 60 seconds. No credit card required. Free forever tier available.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/signup" id="footer-cta-btn">
              <button className="px-9 py-4 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-600/30 hover:shadow-2xl hover:shadow-purple-600/50 hover:scale-[1.03] active:scale-[0.98] transition duration-200 text-base cursor-pointer">
                Create Free Campaign ✨
              </button>
            </Link>
            <Link href="/login" id="footer-login-btn">
              <button className="px-8 py-4 glass-card glass-card-hover text-white font-bold rounded-2xl text-base cursor-pointer">
                Sign In to Dashboard
              </button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-medium pt-4">
            <span>✓ 100% Free to start</span>
            <span>•</span>
            <span>✓ No CC required</span>
            <span>•</span>
            <span>✓ Live in 2 minutes</span>
          </div>

        </div>
      </section>

    </main>
  );
}
