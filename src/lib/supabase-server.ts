import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = () => {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookie = cookieStore.get(name);
          return cookie?.value || '';
        },
        set(name, value, options) {
          // In Next.js, you can't set cookies in a Server Component directly
          // This is handled by Supabase Auth Helpers middleware
        },
        remove(name, options) {
          // In Next.js, you can't remove cookies in a Server Component directly
          // This is handled by Supabase Auth Helpers middleware
        },
      },
    }
  );
}; 