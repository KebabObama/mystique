import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  compress: true,
  reactStrictMode: false,
  output: "standalone",
};

export default nextConfig;
