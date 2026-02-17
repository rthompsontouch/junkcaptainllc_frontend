export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://junkcaptainllc.com",
    "name": "Junk Captain LLC",
    "image": "https://junkcaptainllc.com/brand/logo/logo_original.jpg",
    "logo": "https://junkcaptainllc.com/brand/logo/logo_circle.png",
    "url": "https://junkcaptainllc.com",
    "telephone": "+19199248463",
    "email": "hello@junkcaptainllc.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Raleigh",
      "addressRegion": "NC",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 35.7796,
      "longitude": -78.6382
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Raleigh",
        "containedInPlace": {
          "@type": "State",
          "name": "North Carolina"
        }
      },
      {
        "@type": "City",
        "name": "Cary",
        "containedInPlace": {
          "@type": "State",
          "name": "North Carolina"
        }
      },
      {
        "@type": "City",
        "name": "Apex",
        "containedInPlace": {
          "@type": "State",
          "name": "North Carolina"
        }
      },
      {
        "@type": "City",
        "name": "Durham",
        "containedInPlace": {
          "@type": "State",
          "name": "North Carolina"
        }
      },
      {
        "@type": "City",
        "name": "Fuquay-Varina",
        "containedInPlace": {
          "@type": "State",
          "name": "North Carolina"
        }
      }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "07:00",
        "closes": "19:00"
      }
    ],
    "sameAs": [
      // Add social media profiles here when created
      // "https://www.facebook.com/junkcaptainllc",
      // "https://www.instagram.com/junkcaptainllc"
    ],
    "description": "Professional junk removal services in Raleigh, Cary, Apex, Durham, and Fuquay Varina. Fast, reliable, eco-friendly disposal. Same-day service available. Licensed and insured.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Junk Removal Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Furniture Removal",
            "description": "Professional furniture removal and disposal service"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Appliance Removal",
            "description": "Refrigerators, washers, dryers, and more"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Construction Debris Removal",
            "description": "Post-construction cleanup and debris hauling"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Yard Waste Removal",
            "description": "Branches, leaves, and landscaping debris removal"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Electronics Recycling",
            "description": "Eco-friendly electronics disposal and recycling"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Estate Cleanout",
            "description": "Complete estate and property cleanout services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Hot Tub Removal",
            "description": "Professional hot tub demolition and removal"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mattress Disposal",
            "description": "Mattress and box spring removal service"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Garage Cleanout",
            "description": "Complete garage cleaning and junk removal"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "250",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
