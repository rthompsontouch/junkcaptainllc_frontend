import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <Services />

      {/* Pricing Section */}
      <Pricing />

      {/* FAQ Section */}
      <FAQ />
    </main>
  );
}

