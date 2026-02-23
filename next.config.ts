import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Serve logo when browser requests favicon.ico
      { source: "/favicon.ico", destination: "/brand/logo/logo_circle.png" },
    ];
  },
};

export default nextConfig;
