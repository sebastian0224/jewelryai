import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      title: "AI-Powered Enhancement",
      description:
        "Advanced AI algorithms automatically enhance lighting, remove backgrounds, and perfect every detail of your jewelry photos.",
      icon: "✨",
    },
    {
      title: "Professional Backgrounds",
      description:
        "Choose from dozens of studio-quality backgrounds or upload your own to match your brand aesthetic.",
      icon: "🎨",
    },
    {
      title: "Batch Processing",
      description:
        "Process multiple jewelry photos at once. Perfect for large catalogs and e-commerce stores.",
      icon: "⚡",
    },
    {
      title: "High Resolution Output",
      description:
        "Get crisp, high-resolution images perfect for print, web, and social media marketing.",
      icon: "📸",
    },
    {
      title: "Brand Consistency",
      description:
        "Maintain consistent styling across all your jewelry photos with customizable presets and templates.",
      icon: "🎯",
    },
    {
      title: "Instant Results",
      description:
        "Transform your photos in seconds, not hours. No complex editing software required.",
      icon: "⏱️",
    },
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Everything You Need for Perfect Jewelry Photos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade AI tools designed specifically for jewelry
            photography and e-commerce success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="text-3xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl text-card-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
