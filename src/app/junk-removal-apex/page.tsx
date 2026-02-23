import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Junk Removal Apex NC | Same-Day Service | Junk Captain LLC",
  description: "Professional junk removal in Apex NC. Same-day service, free estimates. Furniture, appliances, construction debris. Licensed & insured. Call (910) 808-1125!",
  alternates: { canonical: "https://junkcaptainllc.com/junk-removal-apex" },
  keywords: [
    "junk removal Apex",
    "junk removal Apex NC",
    "Apex junk removal",
    "furniture removal Apex",
    "same day junk removal Apex",
  ],
  openGraph: {
    title: "Junk Removal Apex NC | Junk Captain LLC",
    description: "Professional junk removal in Apex. Same-day service, free estimates. Call (910) 808-1125!",
    type: "website",
  },
};

export default function JunkRemovalApexPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-navy via-navy to-teal pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Junk Removal <span className="text-orange">Apex</span> NC
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto text-center mb-8">
            Fast, reliable junk removal serving Apex (Peak City) and the Triangle. Same-day service available. Free estimates.
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
          <h2 className="text-2xl font-bold text-navy mb-4">Professional Junk Removal in Apex</h2>
          <p>
            Junk Captain LLC provides junk removal services in Apex, NC and the greater Triangle area. 
            We offer same-day pickup when available, transparent pricing, and responsible disposal—donating 
            and recycling whenever possible.
          </p>
          <h3 className="text-xl font-bold text-navy mt-8 mb-3">Serving Peak City & Beyond</h3>
          <p>
            From furniture and appliances to construction debris and estate cleanouts, we handle it all. 
            Licensed, insured, and ready to help. Get your free quote today!
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/#home" className="bg-orange hover:bg-orange/90 text-white font-bold py-3 px-6 rounded-lg">
              Request Your Free Apex Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
