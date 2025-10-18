'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Mic } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0e0f16] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative w-20 h-20 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#0db2f3]/40">
            <Mic className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          We encountered an unexpected error. Please try again or go back to the home page.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0db2f3] to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
