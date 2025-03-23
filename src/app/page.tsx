import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import Image from "next/image";

export default async function HomePage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/auth/login');
  }
  
  // This will never be rendered
  return null;
}
