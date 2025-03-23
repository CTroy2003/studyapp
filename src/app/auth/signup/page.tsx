import { SignUp } from '@/components/auth/SignUp';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | EZStudy',
  description: 'Create an EZStudy account',
};

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md">
      <SignUp />
      <p className="mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </div>
  );
} 