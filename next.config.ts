import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'www.bancamia.com.co' }]
  },
  async rewrites() {
    return [
      {
        source: '/api/authenticate',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/authenticate`,
      },
      {
        source: '/api/payment/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/:path*`,
      },
    ];
  },
};

export default nextConfig;
