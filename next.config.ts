import type { NextConfig } from "next";

export default {
  compress: true,
  reactStrictMode: true,
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
} as NextConfig;
