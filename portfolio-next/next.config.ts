import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // No basePath needed - will be served from portfolio-next/out/
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
