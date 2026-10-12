import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/message": [
      "./app/message-card.css",
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
