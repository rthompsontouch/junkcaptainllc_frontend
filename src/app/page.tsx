import Hero from "@/components/Hero";
import Services from "@/components/Services";
import QuoteCTA from "@/components/QuoteCTA";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <Services />

      {/* Get Quote Section */}
      <QuoteCTA />

      {/* FAQ Section */}
      <FAQ />
    </main>
  );
}

