import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  generateBuildId: async () => "imnFs9Yp0YyXa2A0kXBiS",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
