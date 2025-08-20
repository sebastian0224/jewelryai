// components/Features.tsx
export default function Features() {
  const features = [
    {
      icon: "✨",
      title: "AI-Powered Enhancement",
      description:
        "Advanced AI automatically adjusts lighting, removes backgrounds, and enhances jewelry details for professional results.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Process your jewelry photos in under 30 seconds. No more waiting hours for professional edits.",
    },
    {
      icon: "🎯",
      title: "Jewelry Specialized",
      description:
        "Our AI is specifically trained on jewelry imagery, understanding gemstones, metals, and luxury aesthetics.",
    },
    {
      icon: "📱",
      title: "Easy to Use",
      description:
        "Simple drag-and-drop interface. No design skills required. Upload, process, and download your enhanced photos.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Why Choose JewelryAI?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Transform your jewelry photography with cutting-edge AI technology
            designed specifically for luxury products.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Before/After Preview */}
        <div className="mt-20 bg-slate-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
            See the Difference
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500 font-medium">
                  Before: Raw Photo
                </span>
              </div>
              <p className="text-slate-600">Original jewelry photo</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-amber-700 font-medium">
                  After: AI Enhanced
                </span>
              </div>
              <p className="text-slate-600">
                Professional, studio-quality result
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
