import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // naikkan sesuai kebutuhan, misal 10MB
    },
  },
};

export default nextConfig;