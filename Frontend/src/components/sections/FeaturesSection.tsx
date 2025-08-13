import {
  Mic,
  Zap,
  Globe,
  Users,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Mic,
      title: "Studio-Quality Recording",
      description: "Crystal clear audio capture with noise cancellation and automatic gain control for professional results.",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: Zap,
      title: "Lightning-Fast Processing",
      description: "Real-time transcription with industry-leading speed. Process hours of content in minutes, not hours.",
      gradient: "from-blue-500 to-emerald-500"
    },
    {
      icon: Globe,
      title: "Multi-Dialect Support",
      description: "Comprehensive coverage of Nigerian English variants, Pidgin, and major local languages with cultural context.",
      gradient: "from-emerald-500 to-purple-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share projects, collaborate in real-time, and manage team access with enterprise-grade security.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "Smart Editing",
      description: "AI-powered editing suggestions, automatic punctuation, and intelligent formatting for polished output.",
      gradient: "from-pink-500 to-blue-500"
    },
    {
      icon: ArrowRight,
      title: "Export Anywhere",
      description: "Multiple format support including SRT, VTT, Word, PDF, and direct integration with popular platforms.",
      gradient: "from-blue-500 to-emerald-500"
    },
  ];

  return (
    <section id="features" className="py-12 md:py-16 lg:py-24 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Everything you need for
            <span className="block text-purple-600 dark:text-purple-400">
              voice transformation
            </span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            From podcasters to journalists, content creators to businesses—our
            platform scales with your needs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 md:p-8 bg-background/50 rounded-2xl border border-border/50 backdrop-blur-sm"
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 md:mb-6 shadow-lg`}>
                <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
