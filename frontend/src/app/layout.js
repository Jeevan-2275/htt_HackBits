import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
      <body className={`${inter.className} bg-slate-950 text-slate-100 overflow-x-hidden`}>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
