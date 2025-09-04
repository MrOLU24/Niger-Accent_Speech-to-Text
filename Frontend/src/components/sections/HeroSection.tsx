import { useState } from "react";
import Link from "next/link";
import {
  Mic,
  Zap,
  Globe,
  Search,
  Upload,
  Plus,
  MoreHorizontal,
  Play,
  Shield,
  Brain,
  Languages,
} from "lucide-react";

export default function HeroSection() {
  const [transcriptText, setTranscriptText] = useState("");

  const handleRecordClick = () => {
    // Prompt user to login to experience ToriType
    setTranscriptText("Please login to experience ToriType recording.");
  };

  const handleFeatureClick = (feature: string) => {
    const messages = {
      "Real-time": "✨ Experience lightning-fast transcription as you speak!",
      Privacy: "🔒 Your voice data is secure and never stored on our servers.",
      Accuracy: "🎯 98%+ accuracy for Nigerian English and Pidgin dialects.",
      Culture: "🇳🇬 Built specifically for Nigerian voices and expressions.",
    };
    setTranscriptText(messages[feature as keyof typeof messages] || "");
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[#0e0f16] dark:bg-[#0e0f16] light:bg-gradient-to-br light:from-gray-50 light:to-blue-50 overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating dots */}
        <div className="absolute top-32 left-20 w-2 h-2 bg-[#0db2f3]/30 rounded-full animate-pulse"></div>
        <div className="absolute top-48 right-32 w-1 h-1 bg-[#0db2f3]/20 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-40 left-16 w-1.5 h-1.5 bg-[#0db2f3]/25 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-60 right-20 w-1 h-1 bg-[#0db2f3]/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/4 w-1 h-1 bg-[#0db2f3]/20 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-80 right-1/4 w-1.5 h-1.5 bg-[#0db2f3]/25 rounded-full animate-pulse delay-200"></div>
      </div>

      {/* Zigzag connecting lines with moving elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* SVG for zigzag lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0db2f3" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#0db2f3" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0db2f3" stopOpacity="0.1" />
            </linearGradient>

            {/* Gradient for moving dots */}
            <radialGradient id="dotGradient">
              <stop offset="0%" stopColor="#0db2f3" stopOpacity="1" />
              <stop offset="70%" stopColor="#0db2f3" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0db2f3" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Top-left to center */}
          <path
            id="path1"
            d="M 150 150 Q 300 200 450 300 Q 500 320 550 350"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4,4"
            className="animate-pulse"
          />

          {/* Top-right to center */}
          <path
            id="path2"
            d="M 1050 150 Q 900 200 750 300 Q 700 320 650 350"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4,4"
            className="animate-pulse delay-300"
          />

          {/* Bottom-left to center */}
          <path
            id="path3"
            d="M 200 650 Q 350 550 500 500 Q 550 480 580 450"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4,4"
            className="animate-pulse delay-500"
          />

          {/* Bottom-right to center */}
          <path
            id="path4"
            d="M 1000 650 Q 850 550 700 500 Q 650 480 620 450"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4,4"
            className="animate-pulse delay-700"
          />

          {/* Moving dots along paths */}
          <circle r="3" fill="url(#dotGradient)">
            <animateMotion dur="4s" repeatCount="indefinite" calcMode="paced">
              <mpath href="#path1" />
            </animateMotion>
          </circle>

          <circle r="2.5" fill="url(#dotGradient)">
            <animateMotion
              dur="3.5s"
              repeatCount="indefinite"
              calcMode="paced"
              begin="1s"
            >
              <mpath href="#path2" />
            </animateMotion>
          </circle>

          <circle r="3.5" fill="url(#dotGradient)">
            <animateMotion
              dur="4.5s"
              repeatCount="indefinite"
              calcMode="paced"
              begin="0.5s"
            >
              <mpath href="#path3" />
            </animateMotion>
          </circle>

          <circle r="2.8" fill="url(#dotGradient)">
            <animateMotion
              dur="3.8s"
              repeatCount="indefinite"
              calcMode="paced"
              begin="1.5s"
            >
              <mpath href="#path4" />
            </animateMotion>
          </circle>

          {/* Data packets moving in reverse direction */}
          <rect width="6" height="2" rx="1" fill="#0db2f3" opacity="0.7">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              calcMode="paced"
              begin="2s"
            >
              <mpath href="#path1" />
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="3s"
                repeatCount="indefinite"
                values="0;360"
              />
            </animateMotion>
          </rect>

          <rect width="5" height="2" rx="1" fill="#0db2f3" opacity="0.6">
            <animateMotion
              dur="2.8s"
              repeatCount="indefinite"
              calcMode="paced"
              begin="0.8s"
            >
              <mpath href="#path2" />
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="2.8s"
                repeatCount="indefinite"
                values="360;0"
              />
            </animateMotion>
          </rect>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-6xl mx-auto w-full">
          {/* Top badge with rotating border */}
          <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0db2f3]/10 border border-[#0db2f3]/20 mb-6">
            {/* Rotating border animation */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0db2f3] via-blue-400 to-[#0db2f3] opacity-30 animate-spin"
              style={{ animation: "spin 6s linear infinite" }}
            ></div>
            <div className="absolute inset-[1px] rounded-full bg-[#0e0f16] dark:bg-[#0e0f16] light:bg-gradient-to-br light:from-gray-50 light:to-blue-50"></div>
            <div className="relative flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-[#0db2f3]" />
              <span className="text-xs sm:text-sm font-medium text-white dark:text-white light:text-gray-700">
                Cultural Intelligence
              </span>
            </div>
          </div>

          {/* Main heading - Reduced size */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            <span className="text-white dark:text-white light:text-gray-900">
              Transform Your Voice Into{" "}
            </span>
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#0db2f3] to-blue-400 bg-clip-text text-transparent">
              Perfect Text
            </span>
            <span className="text-white dark:text-white light:text-gray-900">
              {" "}
              with ToriType
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-300 dark:text-gray-300 light:text-gray-600 mb-12 max-w-2xl mx-auto">
            The first AI speech-to-text platform built specifically for Nigerian
            English and Pidgin. Speak naturally, get perfect transcriptions
            instantly.
          </p>

          {/* Main interface mockup with expanded area */}
          <div className="relative max-w-6xl mx-auto mb-12">
            {/* Interactive floating features - Better positioned */}
            <div className="absolute -top-8 -left-4 sm:-top-12 sm:-left-8 md:-top-16 md:-left-12 lg:-left-16 z-20">
              <button
                onClick={() => handleFeatureClick("Real-time")}
                className="relative group bg-gray-800/90 dark:bg-gray-800/90 light:bg-white/95 backdrop-blur-sm rounded-xl px-2 py-2 sm:px-4 sm:py-3 border border-gray-700/50 dark:border-gray-700/50 light:border-gray-200 hover:border-[#0db2f3]/50 transition-all duration-300 hover:scale-105 shadow-lg overflow-hidden"
              >
                {/* Rotating border */}
                <div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0db2f3] via-purple-500 to-[#0db2f3] opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ animation: "spin 4s linear infinite" }}
                ></div>
                <div className="relative flex items-center gap-1 sm:gap-2">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#0db2f3] group-hover:animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium text-white dark:text-white light:text-gray-700">
                    <span className="hidden sm:inline">Real-time Processing</span>
                    <span className="sm:hidden">Real-time</span>
                  </span>
                </div>
              </button>
            </div>

            <div className="absolute -top-8 -right-4 sm:-top-12 sm:-right-8 md:-top-16 md:-right-12 lg:-right-16 z-20">
              <button
                onClick={() => handleFeatureClick("Culture")}
                className="relative group bg-gray-800/90 dark:bg-gray-800/90 light:bg-white/95 backdrop-blur-sm rounded-xl px-2 py-2 sm:px-4 sm:py-3 border border-gray-700/50 dark:border-gray-700/50 light:border-gray-200 hover:border-[#0db2f3]/50 transition-all duration-300 hover:scale-105 shadow-lg overflow-hidden"
              >
                {/* Rotating border */}
                <div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 via-[#0db2f3] to-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ animation: "spin 3.5s linear infinite reverse" }}
                ></div>
                <div className="relative flex items-center gap-1 sm:gap-2">
                  <Languages className="w-3 h-3 sm:w-4 sm:h-4 text-[#0db2f3] group-hover:animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium text-white dark:text-white light:text-gray-700">
                    <span className="hidden sm:inline">Nigerian Culture AI</span>
                    <span className="sm:hidden">Culture AI</span>
                  </span>
                </div>
              </button>
            </div>

            <div className="absolute -bottom-8 left-4 sm:-bottom-12 sm:left-8 md:left-12 lg:left-16 z-20">
              <button
                onClick={() => handleFeatureClick("Privacy")}
                className="relative group bg-gray-800/90 dark:bg-gray-800/90 light:bg-white/95 backdrop-blur-sm rounded-lg px-2 py-2 sm:px-4 sm:py-3 border border-gray-700/50 dark:border-gray-700/50 light:border-gray-200 hover:border-[#0db2f3]/50 transition-all duration-300 hover:scale-105 shadow-lg overflow-hidden"
              >
                {/* Rotating border */}
                <div
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 opacity-0 group-hover:opacity-25 transition-opacity duration-300"
                  style={{ animation: "spin 5s linear infinite" }}
                ></div>
                <div className="relative flex items-center gap-1 sm:gap-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 group-hover:animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium text-white dark:text-white light:text-gray-700">
                    <span className="hidden sm:inline">Privacy First</span>
                    <span className="sm:hidden">Privacy</span>
                  </span>
                </div>
              </button>
            </div>

            <div className="absolute -bottom-8 right-4 sm:-bottom-12 sm:right-8 md:right-12 lg:right-16 z-20">
              <button
                onClick={() => handleFeatureClick("Accuracy")}
                className="relative group bg-gray-800/90 dark:bg-gray-800/90 light:bg-white/95 backdrop-blur-sm rounded-lg px-2 py-2 sm:px-4 sm:py-3 border border-gray-700/50 dark:border-gray-700/50 light:border-gray-200 hover:border-[#0db2f3]/50 transition-all duration-300 hover:scale-105 shadow-lg overflow-hidden"
              >
                {/* Rotating border */}
                <div
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#0db2f3] via-blue-400 to-[#0db2f3] opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ animation: "spin 4.5s linear infinite reverse" }}
                ></div>
                <div className="relative flex items-center gap-1 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#0db2f3] rounded-full group-hover:animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-white dark:text-white light:text-gray-700">
                    <span className="hidden sm:inline">98% Accuracy</span>
                    <span className="sm:hidden">98%</span>
                  </span>
                </div>
              </button>
            </div>

            {/* Main chat interface - Reduced size */}
            <div className="bg-gray-800/70 dark:bg-gray-800/70 light:bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 dark:border-gray-700/50 light:border-gray-200 p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"></div>
                <div className="flex items-center gap-1">
                  <button className="w-5 h-5 border border-gray-600 dark:border-gray-600 light:border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-100 transition-colors">
                    <Plus className="w-2.5 h-2.5 text-gray-400 dark:text-gray-400 light:text-gray-600" />
                  </button>
                  <button className="w-5 h-5 border border-gray-600 dark:border-gray-600 light:border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-100 transition-colors">
                    <MoreHorizontal className="w-2.5 h-2.5 text-gray-400 dark:text-gray-400 light:text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Input/Output area - Reduced size */}
              <div className="relative">
                <div className="bg-gray-700/50 dark:bg-gray-700/50 light:bg-gray-50 rounded-xl border border-gray-600/50 dark:border-gray-600/50 light:border-gray-200 p-3 min-h-[70px] flex items-start">
                  <div className="flex-1">
                    {transcriptText ? (
                      <p className="text-sm text-white dark:text-white light:text-gray-900 leading-relaxed">
                        {transcriptText}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-500">
                        🎤 Press record to start speaking in English or
                        Pidgin... <br />
                        <span className="text-[#0db2f3]">
                          Try: &ldquo;How you dey?&rdquo; or &ldquo;What&apos;s happening?&rdquo;
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom controls - Reduced size */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-100 transition-colors">
                      <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-400 light:text-gray-600" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-100 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-gray-400 dark:text-gray-400 light:text-gray-600" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-100 transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5 text-gray-400 dark:text-gray-400 light:text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={handleRecordClick}
                    disabled={false}
                    className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                      "bg-[#0db2f3] hover:bg-[#0db2f3]/90 text-white hover:scale-105"
                    }`}
                  >
                    <>
                      <Mic className="w-3 h-3" />
                      <span>Record</span>
                    </>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions & Social links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="flex items-center gap-1.5 hover:text-[#0db2f3] transition-colors">
                <Play className="w-3 h-3" />
                <span>Try Demo</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#0db2f3] transition-colors">
                <Globe className="w-3 h-3" />
                <span>Learn More</span>
              </button>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="#" className="hover:text-[#0db2f3] transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-[#0db2f3] transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-[#0db2f3] transition-colors">
                LinkedIn
              </a>
            </div>
            <div className="flex items-center gap-1">
              <span className="hidden sm:inline">Scroll to explore</span>
              <span className="animate-bounce">↓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
