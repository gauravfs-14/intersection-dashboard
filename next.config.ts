import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingExcludes: {
    "*": ["py-scripts/**/*"],
  },
};

export default nextConfig;
