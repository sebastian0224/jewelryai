// components/Pricing.tsx
export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out JewelryAI",
      features: [
        "5 images per month",
        "Basic AI enhancement",
        "Standard download quality",
        "Email support",
      ],
      cta: "Start Free",
      popular: false,
      buttonStyle: "border-2 border-slate-200 text-slate-700 hover:bg-slate-50",
    },
    {
      name: "Professional",
      price: "$19",
      period: "per month",
      description: "Ideal for jewelry professionals and small businesses",
      features: [
        "100 images per month",
        "Premium AI enhancement",
        "High-resolution downloads",
        "Priority support",
        "Commercial license",
        "Batch processing",
      ],
      cta: "Start Professional",
      popular: true,
      buttonStyle: "bg-amber-500 hover:bg-amber-600 text-white",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the plan that fits your jewelry photography needs. Upgrade or
            downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                plan.popular ? "ring-2 ring-amber-500 transform scale-105" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-slate-600 ml-2">/{plan.period}</span>
                </div>
                <p className="text-slate-600">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-amber-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${plan.buttonStyle}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-slate-600">
            <span className="font-semibold">30-day money-back guarantee.</span>{" "}
            No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
}
