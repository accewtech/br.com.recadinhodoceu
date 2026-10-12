import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/message": ["./app/message-card.css"],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
