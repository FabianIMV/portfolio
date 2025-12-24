import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/portfolio/portfolio-next/out',
  assetPrefix: '/portfolio/portfolio-next/out/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
