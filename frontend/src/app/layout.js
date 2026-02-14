import { Inter } from 'next/font/google';
import LayoutWrapper from '@/components/LayoutWrapper';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Feedspace - AI Video Testimonial Generator for Businesses',
  description: 'Automatically collect, process and generate marketing-ready testimonial clips using AI. Transform customer stories into powerful marketing gold.',
  keywords: 'testimonials, video marketing, AI video, customer testimonials, video generator, marketing, automated',
  authors: [{ name: 'Feedspace' }],
  openGraph: {
    type: 'website',
    url: 'https://feedspace.io',
    title: 'Feedspace - AI Video Testimonial Generator for Businesses',
    description: 'Automatically collect, process and generate marketing-ready testimonial clips using AI.',
    images: [
      {
        url: 'https://feedspace.io/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Feedspace - AI Video Testimonial Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Feedspace - AI Video Testimonial Generator for Businesses',
    description: 'Automatically collect, process and generate marketing-ready testimonial clips using AI.',
    images: ['https://feedspace.io/og-image.png'],
  },
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://feedspace.io" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 overflow-x-hidden relative`}>
        {/* Global Gradient Background Glow */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none z-0"></div>
        
        {/* Animated Background Blobs */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
        <div className="fixed bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-4000"></div>

        <div className="relative z-10">
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </div>
      </body>
    </html>
  );
}
