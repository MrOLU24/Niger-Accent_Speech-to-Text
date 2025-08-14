import { Play, ArrowRight } from "lucide-react";
import { useRef } from "react";

export default function CTASection() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section 
      ref={containerRef}
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-[#0e0f16] via-[#0e0f16]/95 to-[#0e0f16] dark:from-[#0e0f16] dark:via-[#0e0f16]/95 dark:to-[#0e0f16] light:from-white light:via-gray-50 light:to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0db2f3]/10 via-transparent to-blue-500/10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0db2f3]/20 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean, borderless CTA */}
        <div className="text-center max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white dark:text-white light:text-gray-900 mb-4 md:mb-6">
            Ready to transform your{" "}
            <span className="bg-gradient-to-r from-[#0db2f3] to-blue-500 bg-clip-text text-transparent">
              voice?
            </span>
          </h3>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 dark:text-gray-300 light:text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of Nigerians using ToriType for accurate,
            culturally-aware transcription. Start your free trial today.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <button className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#0db2f3] to-blue-500 px-8 md:px-10 py-4 md:py-5 font-semibold text-white hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0db2f3]/30 hover:shadow-xl hover:shadow-[#0db2f3]/40">
              <Play className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-base md:text-lg">Start free trial</span>
            </button>
            <button className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 font-semibold text-white dark:text-white light:text-gray-900 border border-[#0db2f3]/30 rounded-full hover:bg-[#0db2f3]/10 hover:border-[#0db2f3]/50 transition-all duration-300">
              <span className="text-base md:text-lg group-hover:text-[#0db2f3] transition-colors duration-300">See how it works</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:text-[#0db2f3] transition-all duration-300" />
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 text-sm text-gray-400 dark:text-gray-400 light:text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#0db2f3] rounded-full"></div>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
