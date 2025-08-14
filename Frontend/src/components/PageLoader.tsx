"use client";

import { useLoading } from "./LoadingProvider";
import { Mic, Brain, Zap, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function PageLoader() {
  const { isLoading, loadingProgress } = useLoading();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything on server side or if not loading
  if (!isClient || !isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0e0f16] dark:bg-[#0e0f16] light:bg-white flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0db2f3]/10 via-transparent to-blue-500/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#0db2f3]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Logo with Animation */}
        <div className="flex items-center space-x-3 group">
          <div className="relative w-16 h-16 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#0db2f3]/40">
            {/* Rotating border effect */}
            <div 
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0db2f3] via-blue-400 to-[#0db2f3] opacity-30"
              style={{ 
                animation: 'spin 3s linear infinite',
                filter: 'blur(2px)'
              }}
            ></div>
            <Mic className="relative w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold bg-gradient-to-r from-[#0db2f3] to-blue-400 bg-clip-text text-transparent">
              ToriType
            </span>
            <span className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 font-medium -mt-1">
              Nigerian AI
            </span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center space-x-4">
          {/* Animated Icons */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-[#0db2f3] rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-white dark:text-white light:text-gray-900">
            Loading ToriType
          </p>
          <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 animate-pulse">
            Preparing your Nigerian AI experience...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-700 dark:bg-gray-700 light:bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${Math.min(loadingProgress, 100)}%`
            }}
          ></div>
        </div>

        {/* Loading Percentage */}
        <div className="text-center">
          <span className="text-lg font-bold bg-gradient-to-r from-[#0db2f3] to-blue-400 bg-clip-text text-transparent">
            {Math.round(Math.min(loadingProgress, 100))}%
          </span>
        </div>

        {/* AI Status Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0db2f3]/10 border border-[#0db2f3]/20 backdrop-blur-sm">
          <Loader2 className="w-4 h-4 text-[#0db2f3] animate-spin" />
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-300 dark:text-gray-300 light:text-gray-600">
              {loadingProgress < 30 ? 'Initializing...' : 
               loadingProgress < 70 ? 'Loading content...' : 
               'Almost ready...'}
            </span>
          </div>
          <Zap className="w-4 h-4 text-blue-400 animate-pulse delay-300" />
        </div>
      </div>
    </div>
  );
}
