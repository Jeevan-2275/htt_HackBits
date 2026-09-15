import LayoutWrapper from '@/components/LayoutWrapper';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const viewport = {
  themeColor: '#3B82F6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://feedspace.io'),
  title: {
    default: 'Feedspace - AI Video Testimonial Platform & Viral Reel Studio',
    template: '%s | Feedspace AI'
  },
  description: 'Automatically collect customer stories, generate AI-powered video testimonials, and export viral 9:16 vertical reels with dynamic captions in seconds.',
  keywords: [
    'video testimonials',
    'AI video testimonials',
    'video review generator',
    'viral reel studio',
    'social proof software',
    'customer feedback video',
    'AI video editor',
    'auto captions reel',
    'customer stories'
  ],
  authors: [{ name: 'Feedspace Team', url: 'https://feedspace.io' }],
  creator: 'Feedspace AI',
  publisher: 'Feedspace Inc.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://feedspace.io',
    siteName: 'Feedspace AI',
    title: 'Feedspace - AI Video Testimonial Platform & Viral Reel Studio',
    description: 'Transform customer feedback into high-converting 9:16 vertical video reels automatically with AI transcription and viral hook highlights.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Feedspace AI Video Testimonials & Viral Reels Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@feedspace_ai',
    creator: '@feedspace_ai',
    title: 'Feedspace - AI Video Testimonial Platform & Viral Reel Studio',
    description: 'Collect, process and turn customer stories into viral video reels instantly with AI.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  // Schema.org Structured Data for SEO Rich Snippets
  const jsonLdSoftware = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Feedspace AI',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All Modern Browsers, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1240',
    },
    featureList: [
      'Autonomous AI Video Interviewer',
      'Instant 9:16 Vertical Reel Auto-Framing',
      'Dynamic Karaoke Subtitles',
      'Viral Hook & Sentiment Analysis',
      'Multi-Platform Social Copy (Instagram, LinkedIn, TikTok)'
    ],
  };

  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Feedspace AI',
    url: 'https://feedspace.io',
    logo: 'https://feedspace.io/logo.png',
    sameAs: [
      'https://twitter.com/feedspace_ai',
      'https://linkedin.com/company/feedspace',
      'https://youtube.com/@feedspace'
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="bg-slate-950 text-slate-100 overflow-x-hidden relative min-h-screen selection:bg-purple-500/30 selection:text-purple-200">
        {/* Global Ambient Glow & Glass Refraction Orbs */}
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-950/30 via-slate-950/90 to-slate-950 pointer-events-none z-0"></div>
        <div className="fixed top-[-10%] left-[15%] w-[600px] h-[600px] bg-cyan-500/15 rounded-full filter blur-[150px] pointer-events-none animate-pulse"></div>
        <div className="fixed top-[40%] right-[-5%] w-[650px] h-[650px] bg-purple-600/15 rounded-full filter blur-[160px] pointer-events-none animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        <div className="fixed bottom-[-10%] left-[30%] w-[550px] h-[550px] bg-pink-500/12 rounded-full filter blur-[150px] pointer-events-none animate-pulse" style={{ animationDelay: '4.5s' }}></div>
        {/* Subtle glass grid texture */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0"></div>

        <div className="relative z-10">
          <AuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
