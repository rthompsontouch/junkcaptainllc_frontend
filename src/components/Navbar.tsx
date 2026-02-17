"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 shadow-lg">
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white hover:text-orange transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="#contact"
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
        <div className="md:hidden bg-navy border-t border-orange/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-white hover:bg-orange/10 hover:text-orange transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block mx-3 my-2 bg-orange hover:bg-orange/90 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 text-center"
            >
              Request Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
