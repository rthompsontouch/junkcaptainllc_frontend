import Link from "next/link";
import type { Metadata } from "next";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Prepare for Junk Removal: A Simple Checklist",
  description: "Get the most out of your junk removal appointment with these easy preparation tips.",
  datePublished: "2026-02-01",
  author: { "@type": "Organization", name: "Junk Captain LLC", url: "https://junkcaptainllc.com" },
  publisher: { "@type": "Organization", name: "Junk Captain LLC", logo: { "@type": "ImageObject", url: "https://junkcaptainllc.com/brand/logo/logo_circle.png" } },
};

export const metadata: Metadata = {
  title: "How to Prepare for Junk Removal: A Simple Checklist",
  description: "Get the most out of your junk removal appointment. Follow these tips to prepare your items, clear access, and ensure a smooth pickup in Raleigh and the Triangle.",
  alternates: { canonical: "https://junkcaptainllc.com/blog/how-to-prepare-for-junk-removal" },
  keywords: [
    "prepare for junk removal",
    "junk removal tips",
    "junk removal Raleigh",
    "decluttering checklist",
  ],
  openGraph: {
    title: "How to Prepare for Junk Removal | Junk Captain LLC",
    description: "Simple tips to prepare for your junk removal appointment. Save time and ensure a smooth pickup.",
    type: "article",
  },
};

export default function HowToPreparePost() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-orange hover:underline mb-6 inline-block">
            ← Back to Blog
          </Link>

          <header className="mb-12">
            <time
              className="text-gray-500 text-sm mb-2 block"
              dateTime="2026-02-01"
            >
              February 1, 2026
            </time>
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              How to Prepare for Junk Removal: A Simple Checklist
            </h1>
            <p className="text-xl text-gray-600">
              Get the most out of your junk removal appointment with these easy preparation tips.
            </p>
          </header>

          <div className="prose prose-lg text-gray-700 max-w-none">
            <p>
              Scheduling a junk removal can feel overwhelming—especially if you have a lot to clear out. 
              A little preparation goes a long way in making the process smooth and efficient. Here&apos;s a 
              simple checklist to help you get ready for your junk removal appointment in Raleigh and the Triangle.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">1. Clear a Path</h2>
            <p>
              Make sure our crew can easily access the items. Move cars, clear walkways, and remove any 
              obstacles. If items are in a garage, basement, or backyard, ensure the path is clear and 
              gates are unlocked. This saves time and helps us give you an accurate quote faster.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">2. Group Similar Items</h2>
            <p>
              If possible, group furniture, appliances, and other items together. You don&apos;t have to 
              move everything—we handle the heavy lifting. But having items in one area makes it easier 
              for us to assess and load everything quickly.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">3. Decide What Stays</h2>
            <p>
              Make sure you&apos;re only removing what you want gone. Double-check that you haven&apos;t 
              accidentally included something you want to keep. Once we load it, it&apos;s on its way!
            </p>

            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">4. Be Present (or Leave Clear Instructions)</h2>
            <p>
              You don&apos;t have to be home for the entire pickup—as long as items are accessible and 
              clearly marked. If you won&apos;t be there, leave instructions for where to find items and 
              any necessary access details.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">5. Know What We Can&apos;t Take</h2>
            <p>
              We can&apos;t accept hazardous materials like paint, chemicals, asbestos, or biological waste. 
              If you&apos;re unsure about an item, just ask—we&apos;re happy to help you figure out the best 
              disposal option.
            </p>

            <p className="mt-10 text-lg">
              Ready to schedule? <Link href="/#home" className="text-orange hover:underline font-semibold">Request a free quote</Link> or 
              call us at <a href="tel:+19108081125" className="text-orange hover:underline font-semibold">(910) 808-1125</a>.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
