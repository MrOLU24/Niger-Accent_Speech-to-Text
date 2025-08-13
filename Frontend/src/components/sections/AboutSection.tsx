import { Globe, MessageSquare, Zap, Headphones } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      icon: Globe,
      title: "Cultural Intelligence",
      description: "Trained on diverse Nigerian speech patterns from Lagos to Kano, understanding regional variations and cultural context.",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: MessageSquare,
      title: "Pidgin Mastery",
      description: "First-class support for Nigerian Pidgin with deep understanding of its grammar, expressions, and cultural significance.",
      gradient: "from-blue-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Lightning-fast transcription with live editing capabilities. See your words appear as you speak with minimal latency.",
      gradient: "from-emerald-500 to-purple-500"
    },
  ];

  return (
    <section id="about" className="py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Built for Nigerian voices,
            <span className="block text-purple-600 dark:text-purple-400">
              powered by AI
            </span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            We understand the unique linguistic patterns, cultural context, and
            speech nuances that make Nigerian communication special. Our AI
            doesn&apos;t just hear words—it understands meaning.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-background/30 rounded-2xl border border-border/30 backdrop-blur-sm"
              >
                <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="space-y-4 p-6 md:p-8 bg-background/30 rounded-2xl border border-border/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium">Processing demo</span>
              </div>
              <div className="space-y-3 text-muted-foreground">
                <p className="border-l-4 border-purple-500 pl-4">
                  &ldquo;Wetin dey happen for this Lagos traffic?&rdquo;
                </p>
                <p className="border-l-4 border-blue-500 pl-4">
                  &ldquo;The meeting go start by 3 o&apos;clock.&rdquo;
                </p>
                <p className="border-l-4 border-emerald-500 pl-4">
                  &ldquo;Make we discuss the project details.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Headphones className="w-4 h-4" />
                <span>Accuracy: 99.2% • Response: 50ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
