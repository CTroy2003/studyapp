import { Login } from '@/components/auth/Login';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | EZStudy',
  description: 'Sign in to your EZStudy account',
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <Login />
      <p className="mt-4 text-center text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-primary-600 hover:text-primary-700">
          Sign up
        </Link>
      </p>
    </div>
  );
} 