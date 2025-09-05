import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative bg-background py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Transform Your Jewelry Photos with{" "}
                <span className="text-secondary">AI Magic</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Turn ordinary jewelry photos into stunning professional studio
                images in seconds. Perfect for e-commerce, marketing, and
                showcasing your precious pieces.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg"
              >
                Try JewelryAI Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg border-border hover:bg-muted bg-transparent"
              >
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Process in seconds</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <img
                src="/elegant-jewelry-transformation-before-and-after-co.jpg"
                alt="Jewelry AI transformation example"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-secondary text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
              AI Enhanced
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
