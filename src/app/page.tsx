export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Professional Junk Removal
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Serving Raleigh, Cary, Apex, Fuquay Varina & Durham
          </p>
          <button className="bg-orange hover:bg-orange/90 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
            Get Free Estimate
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-navy">
            Our Services
          </h2>
          <p className="text-center text-gray-600">Services content coming soon...</p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-navy">
            Pricing Estimates
          </h2>
          <p className="text-center text-gray-600">Pricing content coming soon...</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-navy">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-600">FAQ content coming soon...</p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-teal text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Request Service
          </h2>
          <p className="text-center">Contact form coming soon...</p>
        </div>
      </section>
    </main>
  );
}

