export default function Pricing() {
  const pricingTiers = [
    {
      size: "Single Item",
      price: "$75 - $150",
      description: "Perfect for one or two items",
      items: [
        "One piece of furniture",
        "Small appliance",
        "Mattress",
        "TV or electronics",
      ],
      cta: "Common choice for quick pickups",
    },
    {
      size: "1/4 Truck Load",
      price: "$150 - $250",
      isPopular: true,
      description: "Our most popular option",
      items: [
        "Small room cleanout",
        "3-5 pieces of furniture",
        "Garage declutter",
        "Yard waste pile",
      ],
      cta: "Most popular for homeowners",
    },
    {
      size: "1/2 Truck Load",
      price: "$250 - $400",
      description: "For moderate-sized projects",
      items: [
        "Medium room cleanout",
        "8-10 pieces of furniture",
        "Small renovation debris",
        "Shed cleanout",
      ],
      cta: "Great for renovation projects",
    },
    {
      size: "Full Truck Load",
      price: "$400 - $600",
      description: "Maximum capacity hauling",
      items: [
        "Whole room or garage",
        "15+ pieces of furniture",
        "Full estate cleanout",
        "Large construction debris",
      ],
      cta: "Best value for large projects",
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-teal text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Transparent Pricing
          </h2>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto mb-6">
            No hidden fees. No surprises. Just honest pricing based on volume.
          </p>
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-semibold">
            💰 Final price determined after free on-site assessment
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white text-gray-900 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                tier.isPopular ? "ring-4 ring-orange lg:-translate-y-4" : ""
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-navy mb-2">{tier.size}</h3>
                <div className="text-3xl font-bold text-orange mb-2">{tier.price}</div>
                <p className="text-sm text-gray-600">{tier.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                {tier.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-teal flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-500 text-center italic border-t pt-4">
                {tier.cta}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <a
            href="tel:+19108081125"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="text-4xl mb-3">📞</div>
            <h3 className="font-bold text-lg mb-2">Call for Quote</h3>
            <p className="text-sm text-teal-100">
              Get an instant estimate over the phone
            </p>
          </a>
          <a
            href="#home"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="text-4xl mb-3">👀</div>
            <h3 className="font-bold text-lg mb-2">Free Assessment</h3>
            <p className="text-sm text-teal-100">
              We&apos;ll visit and provide exact pricing
            </p>
          </a>
          <a
            href="#home"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-bold text-lg mb-2">Same Day Service</h3>
            <p className="text-sm text-teal-100">
              Often available for immediate pickup
            </p>
          </a>
        </div>

        {/* What's Included Section */}
        <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8">
            Every Job Includes
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🚛</div>
              <div className="font-semibold">Free Pickup</div>
              <div className="text-sm text-teal-100">No travel charges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💪</div>
              <div className="font-semibold">All Labor</div>
              <div className="text-sm text-teal-100">We do the heavy lifting</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">♻️</div>
              <div className="font-semibold">Eco-Disposal</div>
              <div className="text-sm text-teal-100">Responsible recycling</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🧹</div>
              <div className="font-semibold">Clean Sweep</div>
              <div className="text-sm text-teal-100">Leave area spotless</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <a
            href="#home"
            className="inline-block bg-orange hover:bg-orange/90 text-white font-bold py-4 px-12 rounded-lg text-lg transition-colors shadow-2xl hover:shadow-orange/50"
          >
            Get Your Free Estimate Now
          </a>
        </div>
      </div>
    </section>
  );
}
