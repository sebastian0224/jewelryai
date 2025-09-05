export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-muted py-24 lg:py-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight font-serif">
              Transform Your Jewelry Photos with{" "}
              <span className="text-secondary">AI</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Turn ordinary jewelry photos into stunning professional studio
              images in seconds. Perfect for e-commerce, marketing, and
              showcasing your precious pieces.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground pt-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Process in seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Professional results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
