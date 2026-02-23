import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Junk Removal Raleigh NC | Same-Day Service | Junk Captain LLC",
  description: "Professional junk removal in Raleigh NC. Same-day service, free estimates. Furniture, appliances, construction debris, estate cleanouts. Licensed & insured. Call (910) 808-1125!",
  alternates: { canonical: "https://junkcaptainllc.com/junk-removal-raleigh" },
  keywords: [
    "junk removal Raleigh",
    "junk removal Raleigh NC",
    "Raleigh junk removal",
    "furniture removal Raleigh",
    "same day junk removal Raleigh",
  ],
  openGraph: {
    title: "Junk Removal Raleigh NC | Junk Captain LLC",
    description: "Professional junk removal in Raleigh. Same-day service, free estimates. Call (910) 808-1125!",
    type: "website",
  },
};

export default function JunkRemovalRaleighPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-navy via-navy to-teal pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Junk Removal <span className="text-orange">Raleigh</span> NC
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto text-center mb-8">
            Fast, reliable junk removal serving Raleigh and surrounding areas. Same-day service available. Free estimates.
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
          <h2 className="text-2xl font-bold text-navy mb-4">Professional Junk Removal in Raleigh</h2>
          <p>
            Junk Captain LLC provides professional junk removal services throughout Raleigh, NC and the greater Triangle area. 
            Whether you&apos;re clearing out a garage, moving, renovating, or handling an estate cleanout, we make it easy with 
            same-day service when available and transparent pricing with no hidden fees.
          </p>
          <h3 className="text-xl font-bold text-navy mt-8 mb-3">Our Raleigh Services</h3>
          <p>
            We handle furniture removal, appliance disposal, construction debris, yard waste, electronics recycling, 
            estate cleanouts, hot tub removal, mattress disposal, and more. Licensed, insured, and committed to 
            eco-friendly disposal—we donate and recycle whenever possible.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/#home" className="bg-orange hover:bg-orange/90 text-white font-bold py-3 px-6 rounded-lg">
              Request Your Free Raleigh Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
