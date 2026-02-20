"use client";

import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How much does junk removal cost?",
      answer: "Our pricing is based on the volume of junk removed. Single items start at $75, while a full truck load ranges from $400-$600. We provide free, no-obligation quotes over the phone or on-site. The final price is determined once we see the items in person.",
    },
    {
      question: "Do you offer same-day service?",
      answer: "Yes! We often have same-day availability. Call us in the morning, and we can frequently schedule your pickup for the same afternoon. We understand that timing can be crucial, especially for estate sales, moving deadlines, or renovations.",
    },
    {
      question: "What items do you accept?",
      answer: "We accept almost everything! Furniture, appliances, electronics, yard waste, construction debris, mattresses, hot tubs, and more. We cannot accept hazardous materials like paint, chemicals, asbestos, or biological waste. If you're unsure, just give us a call!",
    },
    {
      question: "Do I need to be present during pickup?",
      answer: "Not necessarily. As long as the items are accessible and clearly marked, we can complete the pickup without you being present. Just ensure we have clear access to the items and any necessary permissions for entry.",
    },
    {
      question: "How does the junk removal process work?",
      answer: "It's simple! First, contact us for a quote. We'll schedule a convenient time for pickup. Our team arrives, provides a final price after seeing the items, and if you approve, we load everything immediately and clean up the area. Payment is made after the job is complete.",
    },
    {
      question: "Are you licensed and insured?",
      answer: "Absolutely! We are fully licensed and insured for your protection. This means your property is protected, and our team is covered. We take safety and professionalism seriously.",
    },
    {
      question: "What areas do you service?",
      answer: "We proudly serve Raleigh, Cary, Apex, Fuquay Varina, Durham, and surrounding areas in the Triangle region. If you're outside these areas, give us a call - we may still be able to help!",
    },
    {
      question: "Do you recycle or donate items?",
      answer: "Yes! We're committed to eco-friendly disposal. We donate usable items to local charities and recycle materials whenever possible. Our goal is to keep as much as possible out of landfills.",
    },
    {
      question: "Can you remove items from inside my home?",
      answer: "Absolutely! Our team will go anywhere on your property to remove items - basements, attics, garages, backyards, you name it. We do all the heavy lifting and hauling so you don't have to.",
    },
    {
      question: "How do I schedule a pickup?",
      answer: "You can call us at (910) 808-1125 or fill out our online form. We'll discuss your needs, provide an estimate, and schedule a convenient time. Most pickups can be scheduled within 24-48 hours.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-navy">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Got questions? We&apos;ve got answers. Can&apos;t find what you&apos;re looking for?{" "}
            <a href="tel:+19108081125" className="text-orange hover:underline font-semibold">
              Give us a call
            </a>
            .
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-lg text-navy pr-8">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-orange flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-navy mb-3">
            Still Have Questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our friendly team is here to help. Get in touch today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+19108081125"
              className="bg-orange hover:bg-orange/90 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call Us Now
            </a>
            <a
              href="#home"
              className="bg-navy hover:bg-navy/90 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Request a Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
