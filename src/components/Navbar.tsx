"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Pricing", href: "#quote" },
    { name: "FAQ", href: "#faq" },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      {/* Top Bar - Only visible at top of page on desktop */}
      <div
        className={`hidden md:block bg-teal text-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
            <p className="font-medium">
              🚀 Fast, Reliable Service • Same-Day Appointments Available!
            </p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:hello@junkcaptainllc.com"
                className="hover:text-orange transition-colors flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                hello@junkcaptainllc.com
              </a>
              <a
                href="tel:+19199248463"
                className="hover:text-orange transition-colors flex items-center gap-1 font-semibold"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                (919) 924-8463
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`text-white fixed left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "top-0 bg-navy/90 shadow-lg backdrop-blur-sm"
            : "top-0 md:top-10 bg-transparent md:bg-transparent bg-navy/90"
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo - positioned to break navbar bounds */}
          <Link href="/" className="flex-shrink-0 relative z-10">
            <div className="relative h-24 w-24 -mb-4">
              <Image
                src="/brand/logo/logo_circle.png"
                alt="Junk Captain LLC"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              // Check if it's a route link or hash link
              const isRouteLink = link.href.startsWith("/");
              const isActive = isRouteLink 
                ? pathname === link.href 
                : activeSection === link.href.slice(1);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-white hover:text-orange transition-all duration-200 font-medium relative group ${
                    isActive ? "text-orange" : ""
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-orange transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}
            <Link
              href="#home"
              className="bg-orange hover:bg-orange/90 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Request Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-white hover:text-orange focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy/95 backdrop-blur-sm border-t border-orange/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              // Check if it's a route link or hash link
              const isRouteLink = link.href.startsWith("/");
              const isActive = isRouteLink 
                ? pathname === link.href 
                : activeSection === link.href.slice(1);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-white hover:bg-orange/10 hover:text-orange transition-colors duration-200 font-medium border-l-4 ${
                    isActive
                      ? "border-orange text-orange bg-orange/10"
                      : "border-transparent"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block mx-3 my-2 bg-orange hover:bg-orange/90 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 text-center"
            >
              Request Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
    </>
  );
}
