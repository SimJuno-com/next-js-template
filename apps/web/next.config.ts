import "@next-js-template/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  output: process.env.VERCEL ? undefined : "standalone",
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.simjuno.com", // Simjuno CDN
      },
    ],
  },
};

export default nextConfig;
