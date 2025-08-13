export default function StatsSection() {
  const stats = [
    { number: "50K+", label: "Active users", sublabel: "Growing daily" },
    { number: "99.2%", label: "Accuracy rate", sublabel: "Nigerian English" },
    { number: "200+", label: "Languages", sublabel: "& dialects" },
    { number: "10M+", label: "Hours processed", sublabel: "This month" },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 md:p-6 lg:p-8 bg-background/50 rounded-2xl border border-border/30 backdrop-blur-sm"
            >
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="font-semibold text-foreground text-xs md:text-sm lg:text-base">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
