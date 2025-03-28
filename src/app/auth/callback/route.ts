import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set(name, value);
            } catch (error) {
              // Handle error
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.delete(name);
            } catch (error) {
              // Handle error
            }
          },
        },
      }
    );
    
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  return NextResponse.redirect(`${origin}/dashboard`);
} 