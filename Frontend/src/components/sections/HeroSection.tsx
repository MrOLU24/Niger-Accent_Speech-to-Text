import Image from "next/image";
import { Mic, Zap, Globe, Play, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-16 md:pb-20 lg:pb-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-4 md:mb-6">
              This is not just
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                technology —
              </span>
              it&apos;s evolution.
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start mb-8 md:mb-12">
              <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 md:px-8 py-3 md:py-4 font-semibold text-white shadow-lg">
                <Play className="w-4 md:w-5 h-4 md:h-5" />
                Start for free
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-6 md:px-8 py-3 md:py-4 font-semibold text-foreground backdrop-blur-sm">
                Watch demo
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
              </button>
            </div>

            {/* Feature tags */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3 text-sm">
              {[
                { icon: Mic, text: "Real-time" },
                { icon: Globe, text: "Nigerian accents" },
                { icon: Zap, text: "99% accuracy" },
              ].map((tag, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 px-3 md:px-4 py-2 text-muted-foreground"
                >
                  <tag.icon className="w-3 md:w-4 h-3 md:h-4" />
                  {tag.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Hero visual */}
          <div className="relative text-center order-1 lg:order-2">
            <div className="relative mb-8 md:mb-12">
              <div className="flex items-center justify-center">
                <Image
                  src="/visual.png"
                  alt="ToriType AI Voice Recognition Interface"
                  width={320}
                  height={320}
                  className="w-60 h-60 md:w-80 md:h-80 object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Feature Details - Under the Image */}
            <div className="space-y-4 md:space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-3">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-foreground text-sm md:text-lg">
                      Real-time Processing
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Instant transcription
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">
                      Nigerian Accents
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Cultural intelligence
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">
                      Pidgin Support
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Native understanding
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">
                      99% Accuracy
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Studio-grade quality
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
