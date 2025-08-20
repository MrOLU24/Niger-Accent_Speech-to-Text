'use client';

import { useState } from 'react';
import { ArrowLeft, Mic } from "lucide-react";
import { Button } from "../../components/ui/button";
import LoadingLink from "../../components/LoadingLink";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Authentication error:', error.message);
        alert('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0f16] dark:bg-[#0e0f16] light:bg-gradient-to-br light:from-gray-50 light:to-blue-50 relative overflow-hidden">
  {/* Background visuals */}
      <div className="absolute inset-0">
  {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0db2f3]/5 via-transparent to-blue-500/5"></div>
        
  {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/6 sm:left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-[#0db2f3]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/6 sm:right-1/4 w-56 h-56 sm:w-80 sm:h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
  {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(13,178,243,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(13,178,243,0.03)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]"></div>
      </div>

  {/* Back button */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <LoadingLink 
          href="/"
          className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/5 dark:bg-white/5 light:bg-white/80 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-gray-200 rounded-xl text-white dark:text-white light:text-gray-700 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-white transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="font-medium text-sm sm:text-base">Back to Home</span>
        </LoadingLink>
      </div>

  {/* Main login UI */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Login card */}
          <div className="bg-white/5 dark:bg-white/5 light:bg-white/80 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/20 dark:shadow-black/20 light:shadow-gray-200/20">
            
            {/* Card header */}
            <div className="text-center mb-6 sm:mb-8">
              {/* Logo */}
              <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-[#0db2f3]/30">
                  <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  {/* Logo pulse */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-xl sm:rounded-2xl opacity-20 animate-ping"></div>
                </div>
                <div className="text-left">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#0db2f3] via-blue-400 to-blue-500 bg-clip-text text-transparent">
                    ToriType
                  </h2>
                  <p className="text-xs text-white/60 dark:text-white/60 light:text-gray-500 font-medium">
                    Nigerian AI Platform
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <p className="text-white/70 dark:text-white/70 light:text-gray-600 text-base sm:text-lg leading-relaxed px-2 sm:px-0">
                  Sign in to start transcribing Nigerian speech with AI precision
                </p>
              </div>
            </div>

            {/* Sign in */}
            <div className="space-y-4 sm:space-y-6">
              {/* Google sign-in */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                size="lg"
                className="w-full h-12 sm:h-14 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-base sm:text-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-xl sm:rounded-2xl"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <span>Signing you in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6 sm:my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10 dark:border-white/10 light:border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 sm:px-4 bg-white/5 dark:bg-white/5 light:bg-white/80 text-white/60 dark:text-white/60 light:text-gray-500 text-xs sm:text-sm font-medium">
                    More options coming soon
                  </span>
                </div>
              </div>

              {/* Other sign-in options */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  disabled
                  className="h-10 sm:h-12 bg-white/5 dark:bg-white/5 light:bg-white/50 border-white/10 dark:border-white/10 light:border-gray-300 text-white/50 dark:text-white/50 light:text-gray-400 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-white/70 cursor-not-allowed rounded-lg sm:rounded-xl text-sm sm:text-base"
                >
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  disabled
                  className="h-10 sm:h-12 bg-white/5 dark:bg-white/5 light:bg-white/50 border-white/10 dark:border-white/10 light:border-gray-300 text-white/50 dark:text-white/50 light:text-gray-400 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-white/70 cursor-not-allowed rounded-lg sm:rounded-xl text-sm sm:text-base"
                >
                  Microsoft
                </Button>
              </div>
            </div>

            {/* Terms & privacy */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 dark:border-white/10 light:border-gray-200">
              <p className="text-xs sm:text-sm text-white/60 dark:text-white/60 light:text-gray-500 text-center leading-relaxed">
                By signing in, you agree to our{" "}
                <a href="#" className="text-[#0db2f3] hover:text-blue-300 transition-colors font-medium">
                  Terms of Service
                </a>
                {" "}and{" "}
                <a href="#" className="text-[#0db2f3] hover:text-blue-300 transition-colors font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Explore link */}
          <div className="text-center mt-4 sm:mt-6">
            <p className="text-white/60 dark:text-white/60 light:text-gray-500 text-sm">
              New to ToriType?{" "}
              <LoadingLink 
                href="/" 
                className="text-[#0db2f3] hover:text-blue-300 transition-colors font-medium"
              >
                Explore our platform
              </LoadingLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
