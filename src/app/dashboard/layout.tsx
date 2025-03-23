import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Dashboard | EZStudy',
  description: 'Manage your notes with EZStudy',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-4 md:p-6 container mx-auto">
        {children}
      </main>
    </div>
  );
} 