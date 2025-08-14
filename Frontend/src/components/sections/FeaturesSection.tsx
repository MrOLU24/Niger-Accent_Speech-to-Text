import { useRef } from "react";

export default function FeaturesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "Studio-Quality Recording",
      description: "Crystal clear audio capture with noise cancellation and automatic gain control for professional results.",
      illustration: (
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <defs>
              <linearGradient id="mic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0db2f3" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Microphone illustration */}
            <rect x="35" y="20" width="10" height="25" rx="5" fill="url(#mic-gradient)" opacity="0.8"/>
            <rect x="37" y="47" width="6" height="8" fill="url(#mic-gradient)" opacity="0.6"/>
            <line x1="30" y1="55" x2="50" y2="55" stroke="url(#mic-gradient)" strokeWidth="2"/>
            {/* Sound waves */}
            <path d="M25 30 Q20 25 20 35 Q20 45 25 40" stroke="#0db2f3" strokeWidth="2" fill="none" opacity="0.6" className="animate-pulse"/>
            <path d="M55 30 Q60 25 60 35 Q60 45 55 40" stroke="#0db2f3" strokeWidth="2" fill="none" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
          </svg>
        </div>
      )
    },
    {
      title: "Lightning-Fast Processing",
      description: "Real-time transcription with industry-leading speed. Process hours of content in minutes, not hours.",
      illustration: (
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <defs>
              <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#0db2f3" />
              </linearGradient>
            </defs>
            {/* Lightning bolt */}
            <path d="M45 15 L30 35 L40 35 L35 65 L50 45 L40 45 Z" fill="url(#lightning-gradient)" className="animate-pulse"/>
            {/* Speed lines */}
            <line x1="15" y1="25" x2="25" y2="25" stroke="#0db2f3" strokeWidth="2" opacity="0.6" className="animate-pulse"/>
            <line x1="55" y1="35" x2="65" y2="35" stroke="#0db2f3" strokeWidth="2" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.2s'}}/>
            <line x1="15" y1="45" x2="25" y2="45" stroke="#0db2f3" strokeWidth="2" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.4s'}}/>
            <line x1="55" y1="55" x2="65" y2="55" stroke="#0db2f3" strokeWidth="2" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
          </svg>
        </div>
      )
    },
    {
      title: "Multi-Dialect Support",
      description: "Comprehensive coverage of Nigerian English variants, Pidgin, and major local languages with cultural context.",
      illustration: (
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <defs>
              <linearGradient id="globe-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0db2f3" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
            {/* Globe */}
            <circle cx="40" cy="40" r="20" fill="none" stroke="url(#globe-gradient)" strokeWidth="2" opacity="0.8"/>
            {/* Meridians */}
            <ellipse cx="40" cy="40" rx="20" ry="8" fill="none" stroke="url(#globe-gradient)" strokeWidth="1.5" opacity="0.6"/>
            <ellipse cx="40" cy="40" rx="8" ry="20" fill="none" stroke="url(#globe-gradient)" strokeWidth="1.5" opacity="0.6"/>
            {/* Connection points */}
            <circle cx="30" cy="30" r="2" fill="#0db2f3" className="animate-ping"/>
            <circle cx="50" cy="35" r="2" fill="#3b82f6" className="animate-ping" style={{animationDelay: '0.5s'}}/>
            <circle cx="35" cy="50" r="2" fill="#0db2f3" className="animate-ping" style={{animationDelay: '1s'}}/>
            <circle cx="55" cy="50" r="2" fill="#3b82f6" className="animate-ping" style={{animationDelay: '1.5s'}}/>
          </svg>
        </div>
      )
    },
    {
      title: "Smart Editing",
      description: "AI-powered editing suggestions, automatic punctuation, and intelligent formatting for polished output.",
      illustration: (
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <defs>
              <linearGradient id="edit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#0db2f3" />
              </linearGradient>
            </defs>
            {/* Document */}
            <rect x="25" y="15" width="30" height="40" rx="3" fill="url(#edit-gradient)" opacity="0.2"/>
            {/* Text lines */}
            <line x1="30" y1="25" x2="45" y2="25" stroke="#0db2f3" strokeWidth="2" opacity="0.8"/>
            <line x1="30" y1="32" x2="50" y2="32" stroke="#0db2f3" strokeWidth="2" opacity="0.6"/>
            <line x1="30" y1="39" x2="42" y2="39" stroke="#0db2f3" strokeWidth="2" opacity="0.8"/>
            {/* AI sparkles */}
            <circle cx="60" cy="20" r="1.5" fill="#0db2f3" className="animate-ping"/>
            <circle cx="65" cy="30" r="1" fill="#3b82f6" className="animate-ping" style={{animationDelay: '0.3s'}}/>
            <circle cx="58" cy="35" r="1.5" fill="#0db2f3" className="animate-ping" style={{animationDelay: '0.6s'}}/>
          </svg>
        </div>
      )
    },
    {
      title: "Export Anywhere",
      description: "Multiple format support including SRT, VTT, Word, PDF, and direct integration with popular platforms.",
      illustration: (
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <defs>
              <linearGradient id="export-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0db2f3" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Central hub */}
            <circle cx="40" cy="40" r="8" fill="url(#export-gradient)" opacity="0.8"/>
            {/* Export arrows */}
            <path d="M25 25 L15 15 M15 15 L20 15 M15 15 L15 20" stroke="#0db2f3" strokeWidth="2" fill="none" opacity="0.6" className="animate-pulse"/>
            <path d="M55 25 L65 15 M65 15 L60 15 M65 15 L65 20" stroke="#0db2f3" strokeWidth="2" fill="none" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.2s'}}/>
            <path d="M25 55 L15 65 M15 65 L20 65 M15 65 L15 60" stroke="#0db2f3" strokeWidth="2" fill="none" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.4s'}}/>
            <path d="M55 55 L65 65 M65 65 L60 65 M65 65 L65 60" stroke="#0db2f3" strokeWidth="2" fill="none" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
            {/* Connection lines */}
            <line x1="32" y1="32" x2="25" y2="25" stroke="url(#export-gradient)" strokeWidth="1.5" opacity="0.4"/>
            <line x1="48" y1="32" x2="55" y2="25" stroke="url(#export-gradient)" strokeWidth="1.5" opacity="0.4"/>
            <line x1="32" y1="48" x2="25" y2="55" stroke="url(#export-gradient)" strokeWidth="1.5" opacity="0.4"/>
            <line x1="48" y1="48" x2="55" y2="55" stroke="url(#export-gradient)" strokeWidth="1.5" opacity="0.4"/>
          </svg>
        </div>
      )
    },
  ];

  return (
    <section 
      ref={containerRef}
      id="features" 
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-[#0e0f16]/80 via-[#0e0f16] to-[#0e0f16]/80 dark:from-[#0e0f16]/80 dark:via-[#0e0f16] dark:to-[#0e0f16]/80 light:from-gray-50 light:via-white light:to-gray-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(13,178,243,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_70%)]"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white dark:text-white light:text-gray-900 mb-4 md:mb-6">
            Everything you need for
            <span className="block bg-gradient-to-r from-[#0db2f3] to-blue-500 bg-clip-text text-transparent">
              voice transformation
            </span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 dark:text-gray-300 light:text-gray-600 max-w-3xl mx-auto">
            From podcasters to journalists, content creators to businesses—our
            platform scales with your needs.
          </p>
        </div>

        {/* Professional Features Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group flex flex-col items-start space-y-4 md:space-y-6 hover:scale-[1.02] transition-all duration-500"
            >
              {/* Custom Illustration */}
              <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                {feature.illustration}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-3 md:mb-4 group-hover:text-[#0db2f3] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed group-hover:text-gray-200 dark:group-hover:text-gray-200 light:group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
