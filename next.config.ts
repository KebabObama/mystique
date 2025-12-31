import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  compress: true,
  cacheComponents: true,
};

export default nextConfig;
