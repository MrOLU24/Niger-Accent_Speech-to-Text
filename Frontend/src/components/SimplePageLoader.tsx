"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Loader2 } from "lucide-react";

export default function SimplePageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Override the router.push method to show loading
    const originalPush = router.push;
    
    router.push = (href: string, options?: any) => {
      // Only show loading for different routes
      if (href !== window.location.pathname) {
        setIsLoading(true);
        
        // Hide loading after navigation completes
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
      
      return originalPush.call(router, href, options);
    };

    return () => {
      // Restore original push method
      router.push = originalPush;
    };
  }, [router]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0e0f16] flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0db2f3]/10 via-transparent to-blue-500/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#0db2f3]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Logo with Animation */}
        <div className="flex items-center space-x-3">
          <div className="relative w-16 h-16 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#0db2f3]/40">
            <Mic className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold bg-gradient-to-r from-[#0db2f3] to-blue-400 bg-clip-text text-transparent">
              ToriType
            </span>
            <span className="text-sm text-gray-400 font-medium -mt-1">
              Nigerian AI
            </span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center space-x-4">
          <Loader2 className="w-6 h-6 text-[#0db2f3] animate-spin" />
          <span className="text-lg font-semibold text-white">Loading...</span>
        </div>
      </div>
    </div>
  );
}
