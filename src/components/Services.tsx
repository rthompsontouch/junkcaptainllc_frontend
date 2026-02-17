export default function Services() {
  const services = [
    {
      title: "Furniture Removal",
      description: "Old sofas, tables, chairs, cabinets, and more. We handle all types of furniture disposal.",
    },
    {
      title: "Appliance Removal",
      description: "Refrigerators, washers, dryers, stoves, and all appliances. Eco-friendly disposal guaranteed.",
    },
    {
      title: "Construction Debris",
      description: "Renovation waste, drywall, wood, flooring materials. We clear it all from your project site.",
    },
    {
      title: "Yard Waste & Debris",
      description: "Branches, leaves, grass clippings, old landscaping. Keep your yard pristine and clean.",
    },
    {
      title: "Electronics Recycling",
      description: "TVs, computers, printers, and e-waste. Responsible recycling for all electronics.",
    },
    {
      title: "Estate Cleanouts",
      description: "Complete property cleanouts with care and respect. We handle downsizing and estate liquidation.",
    },
    {
      title: "Hot Tub Removal",
      description: "Safe removal and disposal of hot tubs and spas. We handle the heavy lifting.",
    },
    {
      title: "Mattress Disposal",
      description: "Responsible mattress and box spring removal. Recycled whenever possible.",
    },
    {
      title: "Garage Cleanout",
      description: "Clear out years of accumulated clutter. Get your garage space back.",
    },
  ];

  return (
    <section id="services" className="py-20 px-4 bg-white pt-32 md:pt-40 lg:pt-48">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left Side - Header and CTA */}
          <div className="lg:col-span-2 lg:sticky lg:top-32">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-navy">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              From single items to full property cleanouts, we handle it all. 
              Professional, reliable junk removal service in the Raleigh area.
            </p>
            
            <div className="mt-12">
              <p className="text-lg text-gray-700 mb-6">
                Don&apos;t see what you&apos;re looking for? We handle almost anything!
              </p>
              <a
                href="#contact"
                className="inline-block bg-orange hover:bg-orange/90 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Get Your Free Quote
              </a>
            </div>
          </div>

          {/* Right Side - Services Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-orange hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-orange transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-teal text-4xl font-bold mb-2">100%</div>
            <div className="text-gray-700 font-semibold mb-1">Licensed & Insured</div>
            <div className="text-gray-600 text-sm">Fully certified and protected</div>
          </div>
          <div className="text-center">
            <div className="text-teal text-4xl font-bold mb-2">Same Day</div>
            <div className="text-gray-700 font-semibold mb-1">Quick Service</div>
            <div className="text-gray-600 text-sm">Often available same-day</div>
          </div>
          <div className="text-center">
            <div className="text-teal text-4xl font-bold mb-2">Eco-Friendly</div>
            <div className="text-gray-700 font-semibold mb-1">Responsible Disposal</div>
            <div className="text-gray-600 text-sm">We recycle and donate when possible</div>
          </div>
        </div>
      </div>
    </section>
  );
}
