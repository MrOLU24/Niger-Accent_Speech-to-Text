import { Headphones } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  // Interactive demo state
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const demoMessages = [
    {
      text: "Wetin dey happen for this Lagos traffic?",
      type: "pidgin",
      translation: "What's happening in this Lagos traffic?",
    },
    {
      text: "The meeting go start by 3 o'clock.",
      type: "mixed",
      translation: "The meeting will start at 3 o'clock.",
    },
    {
      text: "Make we discuss the project details.",
      type: "pidgin",
      translation: "Let's discuss the project details.",
    },
    {
      text: "I wan buy provision for market.",
      type: "pidgin",
      translation: "I want to buy groceries at the market.",
    },
    {
      text: "How far? You don reach house?",
      type: "pidgin",
      translation: "How are you? Have you gotten home?",
    },
  ];

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-cycle through demo messages - only on client side
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentDemoIndex((prev) => (prev + 1) % demoMessages.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [demoMessages.length, isClient]);

  const features = [
    {
      title: "Cultural Intelligence",
      description:
        "Trained on diverse Nigerian speech patterns from Lagos to Kano, understanding regional variations and cultural context.",
      illustration: (
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <defs>
              <linearGradient
                id="brain-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#0db2f3" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Brain illustration */}
            <path
              d="M25 30 Q30 20 40 25 Q50 20 55 30 Q60 35 55 45 Q50 60 40 55 Q30 60 25 45 Q20 35 25 30"
              fill="url(#brain-gradient)"
              opacity="0.8"
              className="animate-pulse"
            />
            <circle
              cx="35"
              cy="35"
              r="2"
              fill="#0db2f3"
              className="animate-ping"
            />
            <circle
              cx="45"
              cy="40"
              r="2"
              fill="#3b82f6"
              className="animate-ping"
              style={{ animationDelay: "0.5s" }}
            />
            <circle
              cx="40"
              cy="50"
              r="2"
              fill="#0db2f3"
              className="animate-ping"
              style={{ animationDelay: "1s" }}
            />
          </svg>
        </div>
      ),
    },
    {
      title: "Pidgin Mastery",
      description:
        "First-class support for Nigerian Pidgin with deep understanding of its grammar, expressions, and cultural significance.",
      illustration: (
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <defs>
              <linearGradient
                id="speech-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#0db2f3" />
              </linearGradient>
            </defs>
            {/* Speech bubbles */}
            <ellipse
              cx="30"
              cy="35"
              rx="12"
              ry="8"
              fill="url(#speech-gradient)"
              opacity="0.6"
              className="animate-bounce"
            />
            <ellipse
              cx="50"
              cy="45"
              rx="10"
              ry="6"
              fill="url(#speech-gradient)"
              opacity="0.8"
              className="animate-bounce"
              style={{ animationDelay: "0.3s" }}
            />
            <path
              d="M25 40 L20 45 L25 43 Z"
              fill="url(#speech-gradient)"
              opacity="0.6"
            />
            <path
              d="M55 48 L60 53 L55 51 Z"
              fill="url(#speech-gradient)"
              opacity="0.8"
            />
          </svg>
        </div>
      ),
    },
    {
      title: "Real-time Processing",
      description:
        "Lightning-fast transcription with live editing capabilities. See your words appear as you speak with minimal latency.",
      illustration: (
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <defs>
              <linearGradient
                id="wave-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#0db2f3" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
            {/* Sound waves */}
            <rect
              x="10"
              y="35"
              width="3"
              height="10"
              fill="url(#wave-gradient)"
              className="animate-pulse"
            />
            <rect
              x="16"
              y="30"
              width="3"
              height="20"
              fill="url(#wave-gradient)"
              className="animate-pulse"
              style={{ animationDelay: "0.1s" }}
            />
            <rect
              x="22"
              y="25"
              width="3"
              height="30"
              fill="url(#wave-gradient)"
              className="animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <rect
              x="28"
              y="20"
              width="3"
              height="40"
              fill="url(#wave-gradient)"
              className="animate-pulse"
              style={{ animationDelay: "0.3s" }}
            />
            <rect
              x="34"
              y="15"
              width="3"
              height="50"
              fill="url(#wave-gradient)"
              className="animate-pulse"
              style={{ animationDelay: "0.4s" }}
            />
            <rect
              x="40"
              y="25"
              width="3"
              height="30"
              fill="url(#wave-gradient)"
              className="animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <rect
              x="46"
              y="30"
              width="3"
              height="20"
              fill="url(#wave-gradient)"
              className="animate-pulse"
              style={{ animationDelay: "0.6s" }}
            />
            <rect
              x="52"
              y="35"
              width="3"
              height="10"
              fill="url(#wave-gradient)"
              className="animate-pulse"
              style={{ animationDelay: "0.7s" }}
            />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <section
      ref={containerRef}
      id="about"
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-[#0e0f16] via-[#0e0f16]/95 to-[#0e0f16] dark:from-[#0e0f16] dark:via-[#0e0f16]/95 dark:to-[#0e0f16] light:from-white light:via-gray-50 light:to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0db2f3]/5 via-transparent to-blue-500/5"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#0db2f3]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white dark:text-white light:text-gray-900 mb-4 md:mb-6">
            Built for Nigerian voices,
            <span className="block bg-gradient-to-r from-[#0db2f3] to-blue-500 bg-clip-text text-transparent">
              powered by AI
            </span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 dark:text-gray-300 light:text-gray-600 max-w-3xl mx-auto">
            We understand the unique linguistic patterns, cultural context, and
            speech nuances that make Nigerian communication special. Our AI
            doesn&apos;t just hear words—it understands meaning.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Features - Professional Layout */}
          <div ref={featuresRef} className="space-y-8 md:space-y-12">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group flex gap-4 md:gap-6 items-start hover:scale-[1.02] transition-all duration-500"
              >
                {/* Custom Illustration */}
                <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                  {feature.illustration}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-3 group-hover:text-[#0db2f3] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-base md:text-lg text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed group-hover:text-gray-200 dark:group-hover:text-gray-200 light:group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Demo */}
          <div ref={demoRef} className="relative">
            <div className="space-y-6 p-6 md:p-8 bg-gradient-to-br from-white/5 to-white/10 dark:from-white/5 dark:to-white/10 light:from-white/80 light:to-white/90 rounded-3xl border border-[#0db2f3]/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-[#0db2f3]/20 transition-all duration-500">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[#0db2f3]">
                  <div className="w-3 h-3 rounded-full bg-[#0db2f3] animate-pulse"></div>
                  <span className="text-sm font-medium">Live Processing</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300 dark:text-gray-300 light:text-gray-600">
                  <Headphones className="w-4 h-4" />
                  <span>Listening...</span>
                </div>
              </div>

              {/* Interactive Message Display */}
              <div className="relative min-h-[200px] space-y-4">
                {isClient ? (
                  demoMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`transform transition-all duration-500 ${
                        index === currentDemoIndex
                          ? `translate-y-0 opacity-100 ${
                              isAnimating ? "scale-95" : "scale-100"
                            }`
                          : index < currentDemoIndex
                          ? "translate-y-[-100px] opacity-0"
                          : "translate-y-[100px] opacity-0"
                      }`}
                      style={{
                        position:
                          index === currentDemoIndex ? "relative" : "absolute",
                        top: index === currentDemoIndex ? "auto" : "0",
                      }}
                    >
                      {/* Original Speech */}
                      <div className="bg-gradient-to-r from-[#0db2f3]/20 to-blue-500/20 p-4 rounded-2xl border-l-4 border-[#0db2f3]">
                        <p className="text-white dark:text-white light:text-gray-900 font-medium">
                          &ldquo;{message.text}&rdquo;
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              message.type === "pidgin"
                                ? "bg-[#0db2f3]/20 text-[#0db2f3]"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {message.type === "pidgin"
                              ? "Nigerian Pidgin"
                              : "Mixed"}
                          </span>
                        </div>
                      </div>

                      {/* Translation */}
                      <div className="ml-4 pl-4 border-l-2 border-gray-500/30">
                        <p className="text-gray-300 dark:text-gray-300 light:text-gray-600 italic">
                          Translation: {message.translation}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback for SSR - show first message without animations
                  <div className="transform translate-y-0 opacity-100">
                    <div className="bg-gradient-to-r from-[#0db2f3]/20 to-blue-500/20 p-4 rounded-2xl border-l-4 border-[#0db2f3]">
                      <p className="text-white dark:text-white light:text-gray-900 font-medium">
                        &ldquo;{demoMessages[0].text}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#0db2f3]/20 text-[#0db2f3]">
                          Nigerian Pidgin
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 pl-4 border-l-2 border-gray-500/30">
                      <p className="text-gray-300 dark:text-gray-300 light:text-gray-600 italic">
                        Translation: {demoMessages[0].translation}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Processing Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-300 dark:text-gray-300 light:text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>
                    Processing:{" "}
                    <span className="text-[#0db2f3] font-semibold">
                      Real-time
                    </span>
                  </span>
                </div>
                <div className="text-gray-300 dark:text-gray-300 light:text-gray-600">
                  Accuracy:{" "}
                  <span className="text-[#0db2f3] font-semibold">99.2%</span>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-1">
                {demoMessages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      isClient && index === currentDemoIndex
                        ? "w-8 bg-[#0db2f3]"
                        : index === 0 && !isClient
                        ? "w-8 bg-[#0db2f3]"
                        : "w-2 bg-gray-500/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
