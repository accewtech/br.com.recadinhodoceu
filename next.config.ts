import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/message": [
      "./src/shared/message-card.css",
      "./src/v1/message-card.css",
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
    "/api/v1/message": [
      "./src/shared/message-card.css",
      "./src/v1/message-card.css",
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
    "/api/v2/message": [
      "./src/shared/message-card.css",
      "./src/v2/message-card.css",
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
