import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication | EZStudy',
  description: 'Sign in or create an account to use EZStudy',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-primary-600 p-8 flex flex-col justify-center items-center text-white">
        <div className="max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Welcome to EZStudy</h1>
          <p className="text-primary-100 mb-6">
            Upload your handwritten notes and organize them by subject.
            Study smarter, not harder.
          </p>
        </div>
      </div>
      <div className="md:w-1/2 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
} 