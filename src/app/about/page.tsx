import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Junk Captain LLC, the Triangle area's trusted junk removal service since 2020. We've helped thousands of customers with fast, eco-friendly junk removal in Raleigh, Cary, Apex, Durham, and Fuquay Varina.",
  keywords: [
    "about junk captain",
    "junk removal company Raleigh",
    "professional junk removal Triangle NC",
    "eco-friendly junk removal",
    "licensed junk removal service",
    "same day junk removal Raleigh"
  ],
  openGraph: {
    title: "About Junk Captain LLC | Professional Junk Removal in Triangle NC",
    description: "Trusted junk removal service serving the Triangle area since 2020. Licensed, insured, and eco-friendly. Call (919) 924-8463!",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <section className="relative bg-gradient-to-br from-navy via-navy to-teal pt-32 pb-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,144,30,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,145,138,0.3),transparent_50%)]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-orange">Junk Captain</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Your trusted partner for junk removal in the Triangle area since 2020
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Founded in 2020, Junk Captain was born from a simple idea: junk removal should be easy, 
                affordable, and environmentally responsible. What started as a single truck operation in 
                Raleigh has grown into the Triangle area&apos;s most trusted junk removal service.
              </p>
              <p className="text-lg text-white/90 leading-relaxed">
                We&apos;ve helped thousands of homeowners, businesses, and property managers reclaim their 
                space by removing unwanted items quickly and professionally. Our commitment to customer 
                service and eco-friendly disposal has made us the go-to choice for junk removal across 
                Raleigh, Cary, Apex, Durham, and Fuquay-Varina.
              </p>
            </div>

            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange/20 to-teal/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl font-bold mb-4">2500+</div>
                  <div className="text-xl">Happy Customers Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Our Mission & Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              What drives us every day to deliver exceptional service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission Card */}
            <div className="bg-gradient-to-br from-orange to-orange/80 p-8 rounded-2xl text-white shadow-xl">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/90 leading-relaxed">
                To provide fast, affordable, and eco-friendly junk removal services that make life 
                easier for our customers while protecting our environment for future generations.
              </p>
            </div>

            {/* Customer First */}
            <div className="bg-gradient-to-br from-teal to-teal/80 p-8 rounded-2xl text-white shadow-xl">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold mb-4">Customer First</h3>
              <p className="text-white/90 leading-relaxed">
                Every decision we make starts with you. From transparent pricing to same-day service, 
                we&apos;re committed to exceeding your expectations on every job.
              </p>
            </div>

            {/* Eco-Friendly */}
            <div className="bg-gradient-to-br from-navy to-navy/80 p-8 rounded-2xl text-white shadow-xl">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold mb-4">Eco-Conscious</h3>
              <p className="text-white/90 leading-relaxed">
                We recycle and donate whenever possible. Over 70% of items we collect are diverted 
                from landfills through responsible disposal and donation programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Why Choose Junk Captain?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re not just another junk removal company
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🚚",
                title: "Same Day Service",
                description: "Need it gone today? We offer same-day pickup for most jobs in the Triangle area."
              },
              {
                icon: "💰",
                title: "Fair Pricing",
                description: "No hidden fees. You see the price before we load, and you only pay for the space you use."
              },
              {
                icon: "👷",
                title: "Professional Team",
                description: "Licensed, insured, and background-checked crew members who treat your property with respect."
              },
              {
                icon: "♻️",
                title: "Eco-Friendly",
                description: "We donate and recycle over 70% of what we haul, keeping items out of landfills."
              },
              {
                icon: "📞",
                title: "Easy Booking",
                description: "Simple online booking or call us directly. We make scheduling your junk removal effortless."
              },
              {
                icon: "🏆",
                title: "5-Star Rated",
                description: "Hundreds of 5-star reviews from satisfied customers across the Triangle area."
              },
              {
                icon: "🏠",
                title: "Full Service",
                description: "We do all the heavy lifting. You just point, and we&apos;ll handle the rest."
              },
              {
                icon: "⚡",
                title: "Fast & Efficient",
                description: "Most jobs completed in under 2 hours. We respect your time and work quickly."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-navy mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Proudly Serving the Triangle
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fast, reliable junk removal across the Triangle area
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 mb-12">
            {[
              { name: "Raleigh", population: "Metro Hub" },
              { name: "Cary", population: "Tech Center" },
              { name: "Apex", population: "Peak City" },
              { name: "Durham", population: "Bull City" },
              { name: "Fuquay-Varina", population: "Minerals & Rails" }
            ].map((city, index) => (
              <div key={index} className="bg-gradient-to-br from-navy to-teal p-6 rounded-xl text-white text-center shadow-lg hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                <p className="text-white/80 text-sm">{city.population}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-6">
                Don&apos;t see your city listed? No problem! We serve the entire Triangle area and beyond. 
                Give us a call and we&apos;ll let you know if we can help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="tel:919-924-8463"
                  className="bg-orange hover:bg-orange/90 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  📞 Call (919) 924-8463
                </Link>
                <Link 
                  href="/#contact"
                  className="bg-navy hover:bg-navy/90 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Request Free Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-navy to-teal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Getting rid of your junk is as easy as 1-2-3
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Book Online or Call",
                description: "Schedule a pickup time that works for you. Most appointments available same-day or next-day.",
                icon: "📅"
              },
              {
                step: "2",
                title: "We Show Up & Quote",
                description: "Our team arrives on time, reviews your items, and provides a no-obligation price quote on the spot.",
                icon: "💵"
              },
              {
                step: "3",
                title: "We Haul It Away",
                description: "Once you approve, we load everything up and clean the area. You relax while we do all the work!",
                icon: "🚚"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-orange rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <div className="text-5xl mb-4 mt-4">{step.icon}</div>
                  <h3 className="text-2xl font-bold text-navy mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-white/30">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
            Ready to Reclaim Your Space?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who trust Junk Captain for fast, affordable, and eco-friendly junk removal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/#contact"
              className="bg-orange hover:bg-orange/90 text-white font-bold py-4 px-10 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
            >
              Get Free Quote
            </Link>
            <Link 
              href="tel:919-924-8463"
              className="bg-navy hover:bg-navy/90 text-white font-bold py-4 px-10 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
            >
              Call (919) 924-8463
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
