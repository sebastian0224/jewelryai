// components/HowItWorks.tsx
export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Upload Your Photo",
      description:
        "Drag and drop your jewelry photo or click to browse. Supports JPG and PNG up to 10MB.",
      icon: "📤",
    },
    {
      number: "2",
      title: "AI Magic Happens",
      description:
        "Our specialized AI processes your image, enhancing lighting, removing backgrounds, and optimizing details.",
      icon: "🤖",
    },
    {
      number: "3",
      title: "Download & Use",
      description:
        "Get your professional-grade jewelry photo in seconds. Perfect for e-commerce, catalogs, and marketing.",
      icon: "⬇️",
    },
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Professional jewelry photography in just three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-slate-700 -translate-x-1/2 z-0"></div>
              )}

              {/* Step Content */}
              <div className="relative z-10">
                <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <div className="bg-amber-500 text-slate-900 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto -mt-12 mb-6 relative z-10">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            Try It Now - Free
          </button>
        </div>
      </div>
    </section>
  );
}
