import { Play, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-emerald-600/10 p-6 md:p-8 lg:p-16 text-center rounded-3xl border border-border/30 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-emerald-600/5 blur-3xl"></div>
          <div className="relative">
            <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
              Ready to transform your voice?
            </h3>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
              Join thousands of Nigerians using ToriType for accurate,
              culturally-aware transcription. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 md:px-8 py-3 md:py-4 font-semibold text-white shadow-lg">
                <Play className="w-4 md:w-5 h-4 md:h-5" />
                Start free trial
              </button>
              <button className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 font-semibold text-foreground">
                See how it works
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
