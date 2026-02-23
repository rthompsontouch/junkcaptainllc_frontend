import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Tips",
  description: "Tips and guides for junk removal, decluttering, and eco-friendly disposal in the Raleigh Triangle area. From Junk Captain LLC.",
  alternates: { canonical: "https://junkcaptainllc.com/blog" },
  openGraph: {
    title: "Junk Removal Tips & Guides | Junk Captain LLC",
    description: "Helpful tips for junk removal and decluttering in Raleigh, Cary, Apex, Durham.",
    type: "website",
  },
};

const posts = [
  {
    slug: "how-to-prepare-for-junk-removal",
    title: "How to Prepare for Junk Removal: A Simple Checklist",
    excerpt: "Get the most out of your junk removal appointment with these easy preparation tips. Save time and ensure a smooth pickup.",
    date: "2026-02-01",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-navy via-navy to-teal pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Junk Removal <span className="text-orange">Tips & Guides</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto text-center">
            Helpful advice for decluttering, junk removal, and eco-friendly disposal in the Triangle area.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="border-b border-gray-200 pb-8 last:border-0">
                <Link href={`/blog/${post.slug}`} className="group block">
                  <h2 className="text-2xl font-bold text-navy group-hover:text-orange transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-2">{post.excerpt}</p>
                  <time className="text-sm text-gray-500" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
