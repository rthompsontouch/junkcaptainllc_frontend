import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Junk Removal Fuquay Varina NC | Same-Day Service | Junk Captain LLC",
  description: "Professional junk removal in Fuquay Varina NC. Same-day service, free estimates. Furniture, appliances, yard waste. Licensed & insured. Call (910) 808-1125!",
  alternates: { canonical: "https://junkcaptainllc.com/junk-removal-fuquay-varina" },
  keywords: [
    "junk removal Fuquay Varina",
    "junk removal Fuquay Varina NC",
    "Fuquay Varina junk removal",
    "furniture removal Fuquay Varina",
  ],
  openGraph: {
    title: "Junk Removal Fuquay Varina NC | Junk Captain LLC",
    description: "Professional junk removal in Fuquay Varina. Same-day service, free estimates. Call (910) 808-1125!",
    type: "website",
  },
};

export default function JunkRemovalFuquayVarinaPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-navy via-navy to-teal pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Junk Removal <span className="text-orange">Fuquay Varina</span> NC
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto text-center mb-8">
            Fast, reliable junk removal serving Fuquay Varina and the Triangle. Same-day service available. Free estimates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#home" className="bg-orange hover:bg-orange/90 text-white font-bold py-4 px-8 rounded-lg text-center">
              Get Free Quote
            </Link>
            <Link href="tel:+19108081125" className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-lg text-center border border-white">
              Call (910) 808-1125
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg text-gray-700">
          <h2 className="text-2xl font-bold text-navy mb-4">Professional Junk Removal in Fuquay Varina</h2>
          <p>
            Junk Captain LLC provides junk removal services in Fuquay Varina, NC and the greater Triangle area. 
            We offer same-day pickup when available, transparent pricing with no hidden fees, and eco-friendly 
            disposal—donating and recycling whenever possible.
          </p>
          <h3 className="text-xl font-bold text-navy mt-8 mb-3">Serving Fuquay Varina & Surrounding Areas</h3>
          <p>
            From furniture and appliances to yard waste and construction debris, we handle it all. 
            Licensed, insured, and committed to great customer service. Get your free quote today!
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/#home" className="bg-orange hover:bg-orange/90 text-white font-bold py-3 px-6 rounded-lg">
              Request Your Free Fuquay Varina Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
