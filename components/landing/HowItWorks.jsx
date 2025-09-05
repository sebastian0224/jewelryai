export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Upload",
      description:
        "Upload your jewelry photos directly to our secure platform. Supports JPG, PNG, and multiple file formats.",
      icon: "📤",
    },
    {
      step: "02",
      title: "Style",
      description:
        "Choose from professional backgrounds, lighting presets, and styling options that match your brand.",
      icon: "🎨",
    },
    {
      step: "03",
      title: "Size",
      description:
        "Select your desired output dimensions and resolution. Perfect for web, print, or social media use.",
      icon: "📏",
    },
    {
      step: "04",
      title: "Generate",
      description:
        "Our AI processes your image in seconds, delivering studio-quality results ready for immediate use.",
      icon: "✨",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            How JewelryAI Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your jewelry photos in just four simple steps. No
            technical expertise required.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-6 relative">
              <div className="relative">
                <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
                  <div className="text-6xl mb-4">{step.icon}</div>
                  <div className="w-16 h-1 bg-gradient-to-r from-secondary to-accent mx-auto rounded-full"></div>
                </div>
                <div className="absolute -top-4 left-4 bg-secondary text-accent-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                  {step.step}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 -right-4 transform">
                  <div className="text-2xl text-muted-foreground">→</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
