import type { NextConfig } from "next";

const API_BASE = process.env.API_BASE ?? "https://ecommerce.routemisr.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ecommerce.routemisr.com" },
    ],
  },

  // Proxy /api/* so both /api/v1 and /api/v2 routes go through Next.js.
  // The real backend URL never appears in the client bundle.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
