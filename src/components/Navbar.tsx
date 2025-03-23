'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const router = useRouter();
  
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };
  
  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="font-bold text-xl">
          EZStudy
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="hover:text-primary-200">
            Dashboard
          </Link>
          <Link href="/dashboard/upload" className="hover:text-primary-200">
            Upload Note
          </Link>
          <button 
            onClick={handleSignOut}
            className="text-white hover:text-primary-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
} 