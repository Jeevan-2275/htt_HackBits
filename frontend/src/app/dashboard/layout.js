import Sidebar from '@/components/Sidebar';
import './dashboard.css';

export const metadata = {
  title: 'Feedspace - Dashboard',
  description: 'Manage your testimonial campaigns',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      <main className="md:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
