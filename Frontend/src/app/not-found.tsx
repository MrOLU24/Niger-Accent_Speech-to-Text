import Link from 'next/link';
import { Mic } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0e0f16] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative w-20 h-20 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#0db2f3]/40">
            <Mic className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0db2f3] to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
