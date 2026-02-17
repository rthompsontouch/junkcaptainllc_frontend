import Link from "next/link";

export default function QuoteCTA() {
  return (
    <section id="quote" className="relative py-24 px-4 overflow-hidden">
      {/* Background with teal gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal via-teal/90 to-navy"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-navy/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transparent, Fair Pricing
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Every junk removal job is unique. We provide free, no-obligation quotes based on the volume and type of items you need removed.
          </p>
        </div>

        {/* How Pricing Works */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
            <div className="text-5xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-white mb-4">1. Send Photos</h3>
            <p className="text-white/90">
              Upload photos of your items through our contact form or text them to us. The more detailed, the better!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
            <div className="text-5xl mb-4">💵</div>
            <h3 className="text-2xl font-bold text-white mb-4">2. Get Instant Quote</h3>
            <p className="text-white/90">
              We&apos;ll review your photos and provide a free estimate based on volume, typically within 1-2 hours.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-white mb-4">3. Approve & Schedule</h3>
            <p className="text-white/90">
              Like the price? Schedule your pickup! We offer same-day and next-day appointments in most cases.
            </p>
          </div>
        </div>

        {/* What Affects Price */}
        <div className="bg-white/10 backdrop-blur-sm p-10 rounded-2xl border border-white/20 mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">What Affects Your Price?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">📦</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Volume</h4>
                <p className="text-white/90">How much space your items take up in our truck (1/4, 1/2, 3/4, or full load)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">🏋️</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Weight & Type</h4>
                <p className="text-white/90">Heavy items like appliances or construction debris may cost slightly more</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">📍</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Location</h4>
                <p className="text-white/90">Distance and accessibility (stairs, elevators, etc.) can affect pricing</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">♻️</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Disposal Fees</h4>
                <p className="text-white/90">Hazardous materials or special disposal requirements may have additional fees</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Guarantee Box */}
        <div className="bg-white p-10 rounded-2xl shadow-2xl mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="text-5xl">🤝</div>
            <h3 className="text-3xl font-bold text-navy">Our Price Guarantee</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-teal mb-2">No Hidden Fees</div>
              <p className="text-gray-600">The quote we give is the price you pay. No surprises at the end.</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal mb-2">Price Match Promise</div>
              <p className="text-gray-600">Find a lower quote? We&apos;ll match it or beat it by 10%.</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal mb-2">Free Estimates</div>
              <p className="text-gray-600">All quotes are 100% free with zero obligation to book.</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Ready to Get Your Free Quote?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/#contact"
              className="bg-orange hover:bg-orange/90 text-white font-bold py-5 px-10 rounded-lg transition-colors duration-200 shadow-xl hover:shadow-2xl text-lg"
            >
              📸 Upload Photos & Get Quote
            </Link>
            <Link
              href="tel:919-924-8463"
              className="bg-white hover:bg-gray-100 text-navy font-bold py-5 px-10 rounded-lg transition-colors duration-200 shadow-xl hover:shadow-2xl text-lg"
            >
              📞 Call (919) 924-8463
            </Link>
          </div>
          <p className="text-white/80 mt-6 text-lg">
            Most quotes provided within 1-2 hours • Same-day service available
          </p>
        </div>
      </div>
    </section>
  );
}
