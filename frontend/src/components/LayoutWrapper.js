'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isRecordingPage = pathname.startsWith('/record');

  return (
    <>
      {!isRecordingPage && <Navbar />}
      <main>{children}</main>
      {!isRecordingPage && <Footer />}
    </>
  );
}
