import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      poll: 300,
    };
    return config;
  },
  // Whitelist your local Kubernetes domain
  allowedDevOrigins: ["ticketing.dev"],
};

export default nextConfig;
