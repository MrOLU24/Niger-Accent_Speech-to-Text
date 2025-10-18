'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#0e0f16] text-white">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4">Error</h1>
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">Something went wrong!</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              A critical error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0db2f3] to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
