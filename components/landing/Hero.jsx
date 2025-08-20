// components/Hero.tsx
export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Professional
              <span className="text-amber-500"> Jewelry</span>
              <br />
              Photography with AI
            </h1>
            <p className="text-xl text-slate-600 mt-6 leading-relaxed">
              Transform ordinary jewelry photos into stunning professional
              images in seconds. Perfect lighting, backgrounds, and detail
              enhancement powered by AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Start Free Trial
              </button>
              <button className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                View Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold text-slate-900">10k+</div>
                <div className="text-slate-600">Images Enhanced</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">500+</div>
                <div className="text-slate-600">Happy Jewelers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">30s</div>
                <div className="text-slate-600">Average Processing</div>
              </div>
            </div>
          </div>

          {/* Demo Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="border-2 border-dashed border-slate-200 rounded-xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">
                    Drop your jewelry photo here
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
              <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium mt-4 hover:bg-slate-800 transition-colors">
                Process with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
